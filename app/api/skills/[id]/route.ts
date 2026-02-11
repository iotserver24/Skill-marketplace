import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply rate limiting: 60 requests per minute per IP
  const rateLimitResponse = rateLimit(request, {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests from this IP',
  });
  
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { id } = await params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid skill ID' }, { status: 400 });
    }

    const db = await getDb();
    const skillsCollection = db.collection('skills');

    const skill = await skillsCollection.findOne({ _id: new ObjectId(id) });

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      skill: {
        id: skill._id.toString(),
        name: skill.name,
        description: skill.description,
        author: skill.author,
        keywords: skill.keywords,
        categories: skill.categories,
        originalUrl: skill.originalUrl,
        processedUrl: skill.processedUrl,
        aiProcessed: skill.aiProcessed,
        downloads: skill.downloads,
        uploadedAt: skill.uploadedAt,
        updatedAt: skill.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get skill error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skill', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
