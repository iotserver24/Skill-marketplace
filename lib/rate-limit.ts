/**
 * Simple IP-based rate limiting using in-memory storage
 * Tracks request counts per IP address with sliding window
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory store for rate limit tracking
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (record.resetAt < now) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /** Maximum number of requests allowed */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Custom message to return when rate limit is exceeded */
  message?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * Get client IP address from request headers
 */
export function getClientIp(request: Request): string {
  // Check common headers for forwarded IP addresses
  const headers = request.headers;
  
  // Try various headers in order of preference
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  const cfConnectingIp = headers.get('cf-connecting-ip'); // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Fallback to a default IP if none found
  return 'unknown';
}

/**
 * Check if a request should be rate limited
 */
export function checkRateLimit(ip: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  // If no record exists or the window has expired, create a new one
  if (!record || record.resetAt < now) {
    const resetAt = now + config.windowMs;
    rateLimitStore.set(ip, { count: 1, resetAt });
    
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetAt,
    };
  }
  
  // Check if limit is exceeded
  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }
  
  // Increment count and allow request
  record.count++;
  
  return {
    allowed: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * Rate limiting middleware for Next.js API routes
 * Returns null if allowed, or a Response object if rate limited
 */
export function rateLimit(request: Request, config: RateLimitConfig): Response | null {
  const ip = getClientIp(request);
  const result = checkRateLimit(ip, config);
  
  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
    
    return new Response(
      JSON.stringify({
        error: config.message || 'Too many requests',
        message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
        limit: result.limit,
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.resetAt.toString(),
        },
      }
    );
  }
  
  return null;
}
