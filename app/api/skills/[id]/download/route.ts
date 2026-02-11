import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { getFromR2 } from '@/lib/r2';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply rate limiting: 30 downloads per minute per IP
  const rateLimitResponse = rateLimit(request, {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many download requests from this IP',
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

    // Extract R2 key from URL
    const processedUrl = skill.processedUrl as string;
    const key = processedUrl.split('/').slice(-2).join('/'); // e.g., "skills/uuid-processed.md"

    // Fetch content from R2
    const content = await getFromR2(key);

    // Increment download counter
    await skillsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { downloads: 1 }, $set: { updatedAt: new Date() } }
    );

    // Return file content with appropriate headers
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="${skill.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md"`,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download skill', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
