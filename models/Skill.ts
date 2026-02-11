import { ObjectId } from 'mongodb';

export interface Author {
  name: string;
  email: string;
  description?: string;
}

export interface AIProcessing {
  securityIssuesFound: boolean;
  modificationsMade: string[];
  qualityScore: number;
}

export interface Skill {
  _id?: ObjectId;
  name: string;
  description: string;
  author: Author;
  keywords: string[];
  categories: string[];
  originalUrl: string;    // R2 URL for original .md file
  processedUrl: string;   // R2 URL for AI-sanitized .md file
  aiProcessed: AIProcessing;
  downloads: number;
  uploadedAt: Date;
  updatedAt: Date;
}

export interface SkillDocument extends Skill {
  _id: ObjectId;
}

// Type for creating a new skill (without auto-generated fields)
export type CreateSkillInput = Omit<Skill, '_id' | 'downloads' | 'uploadedAt' | 'updatedAt'>;

// Type for updating a skill
export type UpdateSkillInput = Partial<Omit<Skill, '_id' | 'uploadedAt'>>;
