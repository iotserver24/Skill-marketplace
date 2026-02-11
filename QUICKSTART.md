# Skills Marketplace - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
cd skills-marketplace
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Cloudflare R2 (get from Cloudflare dashboard)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key  
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=skills-marketplace
R2_PUBLIC_URL=https://pub-xxx.r2.dev

# MongoDB (get from MongoDB Atlas or use local)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/skills-marketplace

# Anthropic API (your custom endpoint)
ANTHROPIC_API_KEY=sk-ant-your-key
ANTHROPIC_BASE_URL=https://api.anthropic.com
ANTHROPIC_MODEL_ID=claude-sonnet-4-20250514

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 🎉

## 📋 What You Need

### Cloudflare R2 Setup (5 min)

1. Go to https://dash.cloudflare.com
2. Navigate to R2 Object Storage
3. Create bucket: `skills-marketplace`
4. Generate API token with Edit permissions
5. Copy Account ID, Access Key, Secret Key
6. Copy public URL (if enabling public access)

### MongoDB Setup (5 min)

**Option A: MongoDB Atlas (Cloud - Free)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (for testing)
5. Get connection string

**Option B: Local MongoDB**

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Connection string
MONGODB_URI=mongodb://localhost:27017/skills-marketplace
```

### Anthropic API Key

Your custom Anthropic endpoint details (already have this)

## 🎯 Test the App

### 1. Upload a Test Skill

Create `test-skill.md`:

```markdown
# React Best Practices

Follow these guidelines when building React components:

## Component Structure
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks

## State Management
- Use useState for local state
- Use useContext for shared state
- Consider useReducer for complex state

## Performance
- Memoize expensive calculations with useMemo
- Use useCallback for event handlers
- Implement code splitting with React.lazy
```

### 2. Upload via Web UI

1. Go to http://localhost:3000/upload
2. Upload `test-skill.md`
3. Fill in your name and email
4. Submit

### 3. Browse and Download

1. Go to http://localhost:3000
2. See your uploaded skill
3. Click to view details
4. Download the processed skill

## 🔧 Common Issues

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### MongoDB Connection Failed

```bash
# Check connection string format
mongodb+srv://username:password@cluster.mongodb.net/database

# Ensure IP is whitelisted in MongoDB Atlas
# Or use 0.0.0.0/0 for development
```

### R2 Upload Failed

- Verify bucket name matches
- Check token has Edit permissions
- Ensure Account ID is correct

### AI Processing Failed

- Verify Anthropic API key
- Check base URL if using custom endpoint
- Monitor rate limits

## 📊 Project Structure

```
skills-marketplace/
├── app/                    # Next.js pages and API routes
│   ├── api/skills/        # REST API endpoints
│   ├── api/mcp/           # MCP endpoints for CLI tools
│   ├── upload/            # Upload page
│   └── skills/[id]/       # Skill detail pages
├── components/            # React components
├── lib/                   # Utilities (R2, MongoDB, AI)
├── models/                # TypeScript types
└── package.json
```

## 🎨 Features to Try

1. **Search**: Use search bar to find skills by keywords
2. **Categories**: Click category tags to filter
3. **Quality Scores**: See AI-assigned quality ratings
4. **Download Stats**: Track how many times skills are downloaded
5. **MCP API**: Test MCP endpoints for programmatic access

## 📡 API Testing

### Using cURL

```bash
# Search skills
curl http://localhost:3000/api/skills/search?q=react

# Get skill details (replace ID)
curl http://localhost:3000/api/skills/123456789/download

# MCP search
curl http://localhost:3000/api/mcp/skills/search?q=python
```

### Using Postman/Insomnia

Import these endpoints:
- GET `http://localhost:3000/api/skills/search`
- GET `http://localhost:3000/api/skills/{id}`
- POST `http://localhost:3000/api/skills/upload`

## 🚢 Deploy to Production

### Vercel (Easiest)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy ✅

### Other Options

- AWS Amplify
- Netlify
- Railway
- Self-hosted with Docker

## 💡 Next Steps

1. Upload more skills
2. Customize the UI
3. Add your branding
4. Integrate with XibeCode
5. Set up MCP server
6. Deploy to production

## 📚 Documentation

- Full README: `README.md`
- API docs: See README API section
- Environment setup: `.env.example`

## 🤝 Need Help?

- Check `README.md` for detailed documentation
- Review code comments
- Test with example skills
- Check console logs for errors

---

**You're all set! Happy coding! 🎉**
