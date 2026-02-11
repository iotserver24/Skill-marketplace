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
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
            ← Back to browse
          </a>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {skill.name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {skill.description}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {skill.categories.map((category: string) => (
              <span
                key={category}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
              >
                {category}
              </span>
            ))}
          </div>

          {/* Download Button */}
          <a
            href={`/api/skills/${id}/download`}
            download
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <span>↓</span>
            Download Skill
          </a>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Author */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
              AUTHOR
            </h3>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {skill.author.name}
            </p>
            {skill.author.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {skill.author.description}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
              STATS
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Downloads</span>
                <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {skill.downloads}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Quality</span>
                <span className={`text-lg font-medium ${quality.color}`}>
                  {quality.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Uploaded</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(skill.uploadedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Keywords */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
            KEYWORDS
          </h3>
          <div className="flex flex-wrap gap-2">
            {skill.keywords.map((keyword: string) => (
              <span
                key={keyword}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* AI Processing Info */}
        {(skill.aiProcessed.securityIssuesFound || skill.aiProcessed.modificationsMade.length > 0) && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-8">
            <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-3">
              🔒 AI SECURITY PROCESSING
            </h3>
            {skill.aiProcessed.securityIssuesFound && (
              <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2">
                Security issues were detected and resolved.
              </p>
            )}
            {skill.aiProcessed.modificationsMade.length > 0 && (
              <div>
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2">
                  Modifications made:
                </p>
                <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                  {skill.aiProcessed.modificationsMade.map((mod: string, i: number) => (
                    <li key={i}>{mod}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* How to Use */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
            💡 How to Use This Skill
          </h3>
          <div className="space-y-3 text-sm text-blue-800 dark:text-blue-300">
            <p>
              <strong>1. Download the skill</strong> by clicking the button above
            </p>
            <p>
              <strong>2. Place it in your project</strong> at <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">./skills/</code> directory
            </p>
            <p>
              <strong>3. Use with XibeCode or MCP</strong> - The skill will be automatically loaded
            </p>
            <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900 rounded">
              <p className="font-mono text-xs">
                # MCP API endpoint<br />
                GET /mcp/skills/{id}/content
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
