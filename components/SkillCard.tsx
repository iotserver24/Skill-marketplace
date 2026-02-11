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
    if (!score) return 'text-gray-400';
    if (score >= 0.8) return 'text-green-600 dark:text-green-400';
    if (score >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  return (
    <a
      href={`/skills/${skill.id}`}
      className="group block p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-400 dark:hover:border-gray-600 transition-all bg-white dark:bg-gray-900"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-1">
          {skill.name}
        </h3>
        {skill.qualityScore && (
          <span className={`text-xs font-medium ${getQualityColor(skill.qualityScore)} shrink-0`}>
            {Math.round(skill.qualityScore * 100)}%
          </span>
        )}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
        {skill.description}
      </p>

      {skill.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {skill.categories.slice(0, 3).map((category) => (
            <span
              key={category}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md"
            >
              {category}
            </span>
          ))}
          {skill.categories.length > 3 && (
            <span className="text-xs text-gray-400">+{skill.categories.length - 3}</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-800">
        <span>{skill.author.name}</span>
        <div className="flex items-center gap-3">
          <span>↓ {skill.downloads}</span>
          <span>{formatDate(skill.uploadedAt)}</span>
        </div>
      </div>
    </a>
  );
}
