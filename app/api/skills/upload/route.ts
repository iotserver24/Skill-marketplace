import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { uploadToR2 } from '@/lib/r2';
import { processSkill } from '@/lib/ai-processor';
import { CreateSkillInput } from '@/models/Skill';

// Validation schema
const uploadSchema = z.object({
  content: z.string().min(10, 'Skill content too short').max(100000, 'Skill content too large'),
  authorName: z.string().min(2, 'Author name required').max(100),
  authorEmail: z.string().email('Valid email required'),
  authorDescription: z.string().max(500).optional(),
  skillName: z.string().min(2).max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validationResult = uploadSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { content, authorName, authorEmail, authorDescription, skillName } = validationResult.data;

    // Generate unique ID for this skill
    const skillId = uuidv4();

    // Step 1: Upload original file to R2
    const originalKey = `skills/${skillId}.md`;
    const originalUpload = await uploadToR2(originalKey, content);

    // Step 2: Process skill with AI
    console.log('Processing skill with AI...');
    const processed = await processSkill(content, skillName);

    // Step 3: Upload processed (sanitized) file to R2
    const processedKey = `skills/${skillId}-processed.md`;
    const processedUpload = await uploadToR2(processedKey, processed.sanitizedContent);

    // Step 4: Save metadata to MongoDB
    const db = await getDb();
    const skillsCollection = db.collection('skills');

    const newSkill: CreateSkillInput = {
      name: processed.name,
      description: processed.description,
      author: {
        name: authorName,
        email: authorEmail,
        description: authorDescription,
      },
      keywords: processed.keywords,
      categories: processed.categories,
      originalUrl: originalUpload.url,
      processedUrl: processedUpload.url,
      aiProcessed: {
        securityIssuesFound: processed.securityIssuesFound,
        modificationsMade: processed.modificationsMade,
        qualityScore: processed.qualityScore,
      },
      downloads: 0,
      uploadedAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await skillsCollection.insertOne(newSkill);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        skillId: result.insertedId.toString(),
        skill: {
          id: result.insertedId.toString(),
          name: newSkill.name,
          description: newSkill.description,
          keywords: newSkill.keywords,
          categories: newSkill.categories,
          processedUrl: newSkill.processedUrl,
          aiProcessed: newSkill.aiProcessed,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload skill', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
