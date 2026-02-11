import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client with custom base URL support
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  baseURL: process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com',
});

export const AI_CONFIG = {
  model: process.env.ANTHROPIC_MODEL_ID || 'claude-sonnet-4-20250514',
  maxTokens: 32768,
  temperature: 0.3, // Lower temperature for consistent metadata extraction
};
