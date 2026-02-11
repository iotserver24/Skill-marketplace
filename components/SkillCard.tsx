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
  rank?: number;
}

export default function SkillCard({ skill, rank }: SkillCardProps) {
  const formatDownloads = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <a
      href={`/skills/${skill.id}`}
      className="group flex items-center gap-4 px-4 py-3.5 border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors"
    >
      {rank !== undefined && (
        <span className="text-sm font-mono text-zinc-500 w-6 text-right shrink-0">
          {rank}
        </span>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-medium text-white group-hover:text-zinc-300 transition-colors truncate">
            {skill.name}
          </h3>
        </div>
        <p className="text-xs text-zinc-500 truncate">
          {skill.author.name}
          {skill.categories.length > 0 && (
            <span className="text-zinc-600"> · {skill.categories.slice(0, 2).join(', ')}</span>
          )}
        </p>
      </div>

      <div className="text-right shrink-0">
        <span className="text-sm font-mono text-zinc-300">
          {formatDownloads(skill.downloads)}
        </span>
        <p className="text-xs text-zinc-600 uppercase tracking-wide">
          installs
        </p>
      </div>
    </a>
  );
}
