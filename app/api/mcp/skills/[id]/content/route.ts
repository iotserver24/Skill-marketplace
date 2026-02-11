import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { getFromR2 } from '@/lib/r2';
import { rateLimit } from '@/lib/rate-limit';

/**
 * MCP-compatible endpoint to get skill content directly
 * Returns the processed skill content as plain text
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply rate limiting: 30 requests per minute per IP
  const rateLimitResponse = rateLimit(request, {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many MCP content requests from this IP',
  });
  
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { id } = await params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { type: 'error', error: 'Invalid skill ID' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const skillsCollection = db.collection('skills');

    const skill = await skillsCollection.findOne({ _id: new ObjectId(id) });

    if (!skill) {
      return NextResponse.json(
        { type: 'error', error: 'Skill not found' },
        { status: 404 }
      );
    }

    // Extract R2 key from URL
    const processedUrl = skill.processedUrl as string;
    const key = processedUrl.split('/').slice(-2).join('/');

    // Fetch content from R2
    const content = await getFromR2(key);

    // Increment download counter
    await skillsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { downloads: 1 }, $set: { updatedAt: new Date() } }
    );

    // Return plain text content for MCP consumption
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Skill-Name': skill.name as string,
        'X-Skill-Author': (skill.author as any).name,
      },
    });
  } catch (error) {
    console.error('MCP get content error:', error);
    return NextResponse.json(
      {
        type: 'error',
        error: 'Failed to fetch skill content',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
