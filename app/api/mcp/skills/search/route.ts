import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { rateLimit } from '@/lib/rate-limit';

/**
 * MCP-compatible search endpoint
 * Returns simplified results optimized for CLI/MCP tools
 */
export async function GET(request: NextRequest) {
  // Apply rate limiting: 60 searches per minute per IP
  const rateLimitResponse = rateLimit(request, {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many MCP search requests from this IP',
  });
  
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    const db = await getDb();
    const skillsCollection = db.collection('skills');

    // Build search filter
    const filter: any = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { keywords: { $regex: query, $options: 'i' } },
        { categories: { $regex: query, $options: 'i' } },
      ];
    }

    // Execute query
    const skills = await skillsCollection
      .find(filter)
      .sort({ 'aiProcessed.qualityScore': -1, downloads: -1 })
      .limit(limit)
      .project({
        _id: 1,
        name: 1,
        description: 1,
        keywords: 1,
        categories: 1,
        downloads: 1,
        'aiProcessed.qualityScore': 1,
      })
      .toArray();

    // MCP-optimized response format
    return NextResponse.json({
      type: 'skill_search_results',
      query,
      results: skills.map((skill) => ({
        id: skill._id.toString(),
        name: skill.name,
        description: skill.description,
        keywords: skill.keywords,
        categories: skill.categories,
        qualityScore: skill.aiProcessed?.qualityScore || 0,
        downloads: skill.downloads,
        downloadUrl: `${process.env.NEXT_PUBLIC_APP_URL}/mcp/skills/${skill._id.toString()}/content`,
      })),
      count: skills.length,
    });
  } catch (error) {
    console.error('MCP search error:', error);
    return NextResponse.json(
      { 
        type: 'error',
        error: 'Search failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
