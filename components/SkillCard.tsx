'use client';

interface SkillCardProps {
  skill: {
    id: string;
    name: string;
    description: string;
    author: {
      name: string;
    };
    keywords: string[];
    categories: string[];
    downloads: number;
    qualityScore?: number;
    uploadedAt: string;
  };
}

export default function SkillCard({ skill }: SkillCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getQualityColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 0.8) return 'text-green-600 dark:text-green-400';
    if (score >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  return (
    <a
      href={`/skills/${skill.id}`}
      className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all bg-white dark:bg-gray-800"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {skill.name}
        </h3>
        {skill.qualityScore && (
          <span className={`text-sm font-medium ${getQualityColor(skill.qualityScore)}`}>
            {Math.round(skill.qualityScore * 100)}% quality
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {skill.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {skill.categories.map((category) => (
          <span
            key={category}
            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded"
          >
            {category}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>by {skill.author.name}</span>
        <div className="flex items-center gap-3">
          <span>↓ {skill.downloads}</span>
          <span>{formatDate(skill.uploadedAt)}</span>
        </div>
      </div>
    </a>
  );
}
