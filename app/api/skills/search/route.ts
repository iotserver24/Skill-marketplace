import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort = searchParams.get('sort') || 'recent'; // recent, popular, quality

    const db = await getDb();
    const skillsCollection = db.collection('skills');

    // Build search filter
    const filter: any = {};

    if (query) {
      // Text search across name, description, keywords
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { keywords: { $regex: query, $options: 'i' } },
      ];
    }

    if (category) {
      filter.categories = category;
    }

    // Build sort criteria
    let sortCriteria: any = {};
    switch (sort) {
      case 'popular':
        sortCriteria = { downloads: -1 };
        break;
      case 'quality':
        sortCriteria = { 'aiProcessed.qualityScore': -1 };
        break;
      case 'recent':
      default:
        sortCriteria = { uploadedAt: -1 };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const skills = await skillsCollection
      .find(filter)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .project({
        _id: 1,
        name: 1,
        description: 1,
        author: 1,
        keywords: 1,
        categories: 1,
        processedUrl: 1,
        downloads: 1,
        uploadedAt: 1,
        'aiProcessed.qualityScore': 1,
      })
      .toArray();

    // Get total count for pagination
    const total = await skillsCollection.countDocuments(filter);

    return NextResponse.json({
      success: true,
      skills: skills.map((skill) => ({
        id: skill._id.toString(),
        name: skill.name,
        description: skill.description,
        author: skill.author,
        keywords: skill.keywords,
        categories: skill.categories,
        processedUrl: skill.processedUrl,
        downloads: skill.downloads,
        qualityScore: skill.aiProcessed?.qualityScore,
        uploadedAt: skill.uploadedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
