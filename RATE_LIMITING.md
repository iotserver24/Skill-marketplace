# Rate Limiting Implementation

This document describes the IP-based rate limiting implemented in the Skills Marketplace API.

## Overview

All API endpoints are now protected with IP-based rate limiting to prevent abuse and ensure fair usage. The implementation uses a sliding window algorithm with in-memory storage.

## Rate Limits by Endpoint

### Upload Endpoint
- **Endpoint**: `POST /api/skills/upload`
- **Limit**: 10 requests per 10 minutes per IP
- **Reason**: Uploading skills involves AI processing which is resource-intensive

### Search Endpoints
- **Endpoints**: 
  - `GET /api/skills/search`
  - `GET /api/mcp/skills/search`
- **Limit**: 60 requests per minute per IP
- **Reason**: Search queries are read-only and relatively lightweight

### Skill Details
- **Endpoint**: `GET /api/skills/[id]`
- **Limit**: 60 requests per minute per IP
- **Reason**: Retrieving skill details is a read-only operation

### Download Endpoints
- **Endpoints**:
  - `GET /api/skills/[id]/download`
  - `GET /api/mcp/skills/[id]/content`
- **Limit**: 30 requests per minute per IP
- **Reason**: Downloads involve R2 storage access and database updates

## Implementation Details

### Rate Limit Module
Location: `lib/rate-limit.ts`

Key features:
- **IP Detection**: Automatically extracts client IP from common headers:
  - `x-forwarded-for` (most proxies)
  - `x-real-ip` (nginx)
  - `cf-connecting-ip` (Cloudflare)
- **Sliding Window**: Uses time-based windows for accurate rate limiting
- **In-Memory Storage**: Fast, lightweight storage with automatic cleanup
- **Standard Headers**: Returns proper HTTP 429 status with retry information

### Response Headers

When rate limited, the API returns:
```
Status: 429 Too Many Requests
Headers:
  Retry-After: <seconds>
  X-RateLimit-Limit: <max requests>
  X-RateLimit-Remaining: 0
  X-RateLimit-Reset: <timestamp>
```

### Response Body
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again in X seconds.",
  "limit": 10,
  "retryAfter": 45
}
```

## Usage in Code

```typescript
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = rateLimit(request, {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests from this IP',
  });
  
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  // Continue with normal request handling
  // ...
}
```

## Configuration

To adjust rate limits, modify the configuration in each route file:

```typescript
const rateLimitResponse = rateLimit(request, {
  maxRequests: 100,     // Max requests allowed
  windowMs: 60 * 1000,  // Time window in milliseconds
  message: 'Custom error message',
});
```

## Testing Rate Limits

### Using curl
```bash
# Test upload rate limit (should fail after 10 requests in 10 minutes)
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/skills/upload \
    -H "Content-Type: application/json" \
    -d '{"content":"test","authorName":"Test","authorEmail":"test@example.com"}' \
    -w "\nStatus: %{http_code}\n\n"
  sleep 1
done

# Test search rate limit (should fail after 60 requests in 1 minute)
for i in {1..70}; do
  curl "http://localhost:3000/api/skills/search?q=test" \
    -w "\nStatus: %{http_code}\n\n"
done
```

### Response Examples

**Normal response:**
```bash
Status: 200 OK
```

**Rate limited response:**
```bash
Status: 429 Too Many Requests
{
  "error": "Too many skill uploads from this IP",
  "message": "Rate limit exceeded. Please try again in 534 seconds.",
  "limit": 10,
  "retryAfter": 534
}
```

## Memory Cleanup

The rate limit store automatically cleans up expired entries every 5 minutes to prevent memory leaks.

## Production Considerations

For production deployments with multiple server instances, consider:

1. **Distributed Storage**: Use Redis or similar for shared rate limit state
2. **Load Balancer**: Ensure IP forwarding headers are properly configured
3. **Cloudflare**: If using Cloudflare, the `cf-connecting-ip` header is automatically used
4. **Rate Limit Tuning**: Adjust limits based on your infrastructure capacity and user patterns

## Future Enhancements

Potential improvements:
- User-based rate limiting (when authentication is added)
- Dynamic rate limits based on server load
- Rate limit bypass for authenticated premium users
- Distributed rate limiting with Redis
- More granular rate limit tracking per endpoint group
