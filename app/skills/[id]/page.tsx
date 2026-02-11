import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { notFound } from 'next/navigation';

async function getSkill(id: string) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const db = await getDb();
  const skillsCollection = db.collection('skills');
  
  const skill = await skillsCollection.findOne({ _id: new ObjectId(id) });
  
  if (!skill) {
    return null;
  }

  return {
    id: skill._id.toString(),
    name: skill.name,
    description: skill.description,
    author: skill.author,
    keywords: skill.keywords,
    categories: skill.categories,
    processedUrl: skill.processedUrl,
    aiProcessed: skill.aiProcessed,
    downloads: skill.downloads,
    uploadedAt: skill.uploadedAt,
    updatedAt: skill.updatedAt,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = await getSkill(id);
  
  if (!skill) {
    return {
      title: 'Skill Not Found',
    };
  }

  return {
    title: `${skill.name} - Skills Marketplace`,
    description: skill.description,
  };
}

export default async function SkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = await getSkill(id);

  if (!skill) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDownloads = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getQualityLabel = (score: number) => {
    if (score >= 0.8) return { label: 'Excellent', color: 'text-emerald-400' };
    if (score >= 0.6) return { label: 'Good', color: 'text-yellow-400' };
    return { label: 'Fair', color: 'text-orange-400' };
  };

  const quality = getQualityLabel(skill.aiProcessed.qualityScore);

  return (
    <div className="px-4 sm:px-6">
      <div className="max-w-3xl mx-auto py-8 sm:py-12">
        {/* Breadcrumb */}
        <a href="/" className="inline-flex items-center text-sm text-zinc-500 hover:text-white transition-colors mb-6">
          ← Back to browse
        </a>

        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
          {skill.name}
        </h1>
        <p className="text-sm text-zinc-400 mb-4">
          by {skill.author.name}
        </p>
        <p className="text-zinc-400 mb-5 text-sm leading-relaxed">
          {skill.description}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {skill.categories.map((category: string) => (
            <span
              key={category}
              className="px-2.5 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-md border border-zinc-700/50"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Download + Stats row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 pb-8 border-b border-zinc-800/80">
          <a
            href={`/api/skills/${id}/download`}
            download
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-200 text-zinc-900 text-sm font-medium rounded-lg transition-colors"
          >
            ↓ Download Skill
          </a>
          <div className="flex items-center gap-5 text-sm">
            <div>
              <span className="font-mono text-white">{formatDownloads(skill.downloads)}</span>
              <span className="text-zinc-500 ml-1.5">installs</span>
            </div>
            <div>
              <span className={`font-medium ${quality.color}`}>{quality.label}</span>
              <span className="text-zinc-500 ml-1.5">quality</span>
            </div>
          </div>
        </div>

        {/* Info sections */}
        <div className="space-y-6">
          {/* Author */}
          {skill.author.description && (
            <div className="border border-zinc-800/80 rounded-lg p-4">
              <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                About the Author
              </h3>
              <p className="text-sm text-zinc-400">{skill.author.description}</p>
            </div>
          )}

          {/* Stats */}
          <div className="border border-zinc-800/80 rounded-lg p-4">
            <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Details
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Downloads</span>
                <span className="font-mono text-zinc-200">{skill.downloads}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Quality Score</span>
                <span className={`font-medium ${quality.color}`}>
                  {Math.round(skill.aiProcessed.qualityScore * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Uploaded</span>
                <span className="text-zinc-300">{formatDate(skill.uploadedAt)}</span>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="border border-zinc-800/80 rounded-lg p-4">
            <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Keywords
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skill.keywords.map((keyword: string) => (
                <span
                  key={keyword}
                  className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded-md"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* AI Security Processing */}
          {(skill.aiProcessed.securityIssuesFound || skill.aiProcessed.modificationsMade.length > 0) && (
            <div className="border border-yellow-800/40 rounded-lg p-4 bg-yellow-950/20">
              <h3 className="text-[10px] font-semibold text-yellow-500 uppercase tracking-wider mb-2">
                🔒 Security Processing
              </h3>
              {skill.aiProcessed.securityIssuesFound && (
                <p className="text-sm text-yellow-400/80 mb-1">
                  Security issues were detected and resolved.
                </p>
              )}
              {skill.aiProcessed.modificationsMade.length > 0 && (
                <ul className="list-disc list-inside text-xs text-yellow-500/70 space-y-0.5">
                  {skill.aiProcessed.modificationsMade.map((mod: string, i: number) => (
                    <li key={i}>{mod}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* How to Use */}
          <div className="border border-zinc-800/80 rounded-lg p-4">
            <h3 className="text-sm font-medium text-zinc-200 mb-3">
              💡 How to Use
            </h3>
            <div className="space-y-2 text-sm text-zinc-400">
              <p><span className="text-zinc-300 font-medium">1.</span> Download the skill file</p>
              <p><span className="text-zinc-300 font-medium">2.</span> Place it in your project&apos;s <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-300">./skills/</code> directory</p>
              <p><span className="text-zinc-300 font-medium">3.</span> Use with XibeCode or MCP — loaded automatically</p>
              <div className="mt-3 p-2.5 bg-zinc-800/80 rounded font-mono text-xs text-zinc-400 border border-zinc-700/50">
                GET /mcp/skills/{id}/content
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
