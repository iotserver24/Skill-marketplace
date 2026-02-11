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

  const getQualityLabel = (score: number) => {
    if (score >= 0.8) return { label: 'Excellent', color: 'text-green-600 dark:text-green-400' };
    if (score >= 0.6) return { label: 'Good', color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: 'Fair', color: 'text-orange-600 dark:text-orange-400' };
  };

  const quality = getQualityLabel(skill.aiProcessed.qualityScore);

  return (
    <div className="px-4 sm:px-6">
      <div className="max-w-3xl mx-auto py-8 sm:py-12">
        {/* Breadcrumb */}
        <a href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6">
          ← Back to browse
        </a>

        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
          {skill.name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {skill.description}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {skill.categories.map((category: string) => (
            <span
              key={category}
              className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Download Button */}
        <a
          href={`/api/skills/${id}/download`}
          download
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-200 text-white dark:text-gray-900 text-sm font-medium rounded-lg transition-colors"
        >
          ↓ Download Skill
        </a>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 mb-6">
          {/* Author */}
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
              Author
            </h3>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {skill.author.name}
            </p>
            {skill.author.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {skill.author.description}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
              Stats
            </h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Downloads</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{skill.downloads}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Quality</span>
                <span className={`font-medium ${quality.color}`}>{quality.label}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Uploaded</span>
                <span className="text-gray-900 dark:text-gray-100">{formatDate(skill.uploadedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Keywords */}
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Keywords
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {skill.keywords.map((keyword: string) => (
              <span
                key={keyword}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* AI Security Processing */}
        {(skill.aiProcessed.securityIssuesFound || skill.aiProcessed.modificationsMade.length > 0) && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800/50 mb-6">
            <h3 className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 uppercase tracking-wide mb-2">
              🔒 Security Processing
            </h3>
            {skill.aiProcessed.securityIssuesFound && (
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-1">
                Security issues were detected and resolved.
              </p>
            )}
            {skill.aiProcessed.modificationsMade.length > 0 && (
              <ul className="list-disc list-inside text-xs text-yellow-600 dark:text-yellow-400 space-y-0.5">
                {skill.aiProcessed.modificationsMade.map((mod: string, i: number) => (
                  <li key={i}>{mod}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* How to Use */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-800 mb-8">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            💡 How to Use
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>1.</strong> Download the skill file</p>
            <p><strong>2.</strong> Place it in your project&apos;s <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">./skills/</code> directory</p>
            <p><strong>3.</strong> Use with XibeCode or MCP — loaded automatically</p>
            <div className="mt-3 p-2 bg-gray-200 dark:bg-gray-700 rounded font-mono text-xs">
              GET /mcp/skills/{id}/content
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
