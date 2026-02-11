# Skills Marketplace

A community-powered marketplace for AI coding assistant skills. Upload, discover, and download skills to enhance your AI-powered development workflow.

## Features

- 🚀 **Upload Skills** - Share your expertise with .md skill files
- 🤖 **AI Processing** - Automatic metadata extraction and security scanning
- 🔍 **Search & Browse** - Find skills by keywords, categories, or names
- 📦 **MCP Integration** - API endpoints for XibeCode and MCP tools
- 🔒 **Security First** - AI removes sensitive information automatically
- 💯 **Quality Scoring** - AI-powered quality assessment
- 📊 **Analytics** - Track downloads and popularity

## Tech Stack

- **Frontend/Backend**: Next.js 16.1.6 (App Router)
- **Database**: MongoDB
- **Storage**: Cloudflare R2 (S3-compatible)
- **AI**: Anthropic Claude API
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or Atlas)
- Cloudflare R2 account
- Anthropic API key

## Setup

### 1. Clone and Install

```bash
git clone <your-repo>
cd skills-marketplace
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:

```env
# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=skills-marketplace
R2_PUBLIC_URL=https://pub-xxx.r2.dev

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/skills-marketplace

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-your-key
ANTHROPIC_BASE_URL=https://api.anthropic.com  # Optional custom endpoint
ANTHROPIC_MODEL_ID=claude-sonnet-4-20250514   # Optional custom model

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Cloudflare R2

1. Create a Cloudflare account
2. Go to R2 Object Storage
3. Create a new bucket named `skills-marketplace`
4. Generate API tokens:
   - Navigate to "Manage R2 API Tokens"
   - Create new token with "Edit" permissions
   - Copy Account ID, Access Key, and Secret Key
5. Enable public access (optional):
   - Go to bucket settings
   - Enable public URL access
   - Copy the public URL

### 4. Set Up MongoDB

**Option A: MongoDB Atlas (Recommended)**

1. Create account at [mongodb.com](https://www.mongodb.com/)
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string and add to `.env`

**Option B: Local MongoDB**

```bash
# Install MongoDB locally
brew install mongodb-community  # macOS
# or download from mongodb.com

# Start MongoDB
brew services start mongodb-community

# Use local connection string
MONGODB_URI=mongodb://localhost:27017/skills-marketplace
```

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Usage

### Web Interface

1. **Browse Skills**: Visit homepage to see all skills
2. **Search**: Use search bar to find specific skills
3. **Upload**: Click "Upload Skill" to share your skill
4. **Download**: View skill details and click "Download"

### API Endpoints

#### Upload Skill
```bash
POST /api/skills/upload
Content-Type: application/json

{
  "content": "# Your skill markdown content...",
  "authorName": "John Doe",
  "authorEmail": "john@example.com",
  "authorDescription": "Full-stack developer",
  "skillName": "React Best Practices"  // Optional
}
```

#### Search Skills
```bash
GET /api/skills/search?q=react&page=1&limit=20
```

#### Get Skill Details
```bash
GET /api/skills/{id}
```

#### Download Skill
```bash
GET /api/skills/{id}/download
```

### MCP Endpoints

For integration with XibeCode and other MCP tools:

#### Search Skills (MCP)
```bash
GET /api/mcp/skills/search?q=react&limit=10
```

#### Get Skill Content (MCP)
```bash
GET /api/mcp/skills/{id}/content
```

## How It Works

### Upload Flow

1. User uploads `.md` skill file with author details
2. Original file stored in R2: `skills/{uuid}.md`
3. Claude AI processes the skill:
   - Extracts metadata (name, description, keywords, categories)
   - Performs security scan (removes API keys, PII, malicious content)
   - Generates quality score
   - Creates sanitized version
4. Processed file stored in R2: `skills/{uuid}-processed.md`
5. Metadata saved to MongoDB
6. Skill becomes searchable

### AI Processing

Claude analyzes each skill for:

- **Metadata Extraction**: Auto-generates name, description, keywords, categories
- **Security Scanning**: Detects and removes:
  - API keys and tokens
  - Personal information (emails, phone numbers)
  - Malicious prompts
  - Suspicious URLs
- **Quality Assessment**: Scores based on clarity, usefulness, completeness
- **Sanitization**: Replaces secrets with placeholders, keeps skill functional

## Project Structure

```
skills-marketplace/
├── app/
│   ├── api/
│   │   ├── skills/
│   │   │   ├── upload/route.ts      # Upload endpoint
│   │   │   ├── search/route.ts      # Search endpoint
│   │   │   └── [id]/
│   │   │       ├── route.ts         # Get skill details
│   │   │       └── download/route.ts
│   │   └── mcp/
│   │       └── skills/
│   │           ├── search/route.ts  # MCP search
│   │           └── [id]/content/route.ts
│   ├── skills/[id]/page.tsx         # Skill detail page
│   ├── upload/page.tsx              # Upload page
│   ├── page.tsx                     # Home/browse page
│   └── layout.tsx                   # Root layout
├── components/
│   ├── UploadForm.tsx
│   ├── SkillCard.tsx
│   └── SearchBar.tsx
├── lib/
│   ├── r2.ts                        # R2 storage utilities
│   ├── mongodb.ts                   # MongoDB connection
│   ├── anthropic.ts                 # Claude API client
│   └── ai-processor.ts              # AI skill processing
├── models/
│   └── Skill.ts                     # TypeScript types
└── package.json
```

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Works on any platform supporting Next.js:
- AWS Amplify
- Netlify
- Railway
- Self-hosted with Docker

## Environment-Specific Notes

### Custom Anthropic Endpoint

Support for custom API endpoints (Azure, AWS Bedrock, proxy):

```env
ANTHROPIC_BASE_URL=https://your-custom-endpoint.com/v1
```

### Model Selection

Use different Claude models:

```env
ANTHROPIC_MODEL_ID=claude-opus-4-5-20251101  # For higher quality
# or
ANTHROPIC_MODEL_ID=claude-haiku-4-5-20251001 # For faster/cheaper
```

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check connection string format
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true

# Whitelist IP in MongoDB Atlas
# Or use 0.0.0.0/0 for testing
```

### R2 Upload Failures

```bash
# Verify R2 credentials
# Check bucket name matches
# Ensure token has Edit permissions
```

### AI Processing Errors

```bash
# Check API key is valid
# Verify base URL if using custom endpoint
# Monitor rate limits
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## License

MIT

## Support

- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Email: support@example.com

## Roadmap

- [ ] User authentication (optional)
- [ ] Skill versioning
- [ ] Comments and ratings
- [ ] Vector search (semantic)
- [ ] Skill collections/bundles
- [ ] GitHub integration
- [ ] Analytics dashboard
- [ ] Donation integration

---

Built with ❤️ for the AI coding community
