import SearchBar from '@/components/SearchBar';
import SkillCard from '@/components/SkillCard';

async function getSkills(searchQuery?: string, page: number = 1) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '20',
  });
  
  if (searchQuery) {
    params.set('q', searchQuery);
  }

  const url = `${baseUrl}/api/skills/search?${params.toString()}`;
  
  try {
    const response = await fetch(url, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch skills:', response.statusText);
      return { skills: [], pagination: { page: 1, totalPages: 0, total: 0 } };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching skills:', error);
    return { skills: [], pagination: { page: 1, totalPages: 0, total: 0 } };
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q;
  const page = parseInt(params.page || '1');
  
  const data = await getSkills(query, page);
  const { skills, pagination } = data;

  return (
    <div className="px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center pt-16 pb-10 sm:pt-24 sm:pb-14">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
            Skills Marketplace
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mb-8 max-w-md mx-auto">
            Discover, share, and install community-powered skills for AI coding assistants
          </p>
          <SearchBar />
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mb-8 text-center">
          <div>
            <div className="text-lg font-mono font-semibold text-white">
              {pagination.total}
            </div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider mt-0.5">
              Skills
            </div>
          </div>
          <div className="w-px h-6 bg-zinc-800" />
          <div>
            <div className="text-lg font-mono font-semibold text-white">
              {skills.reduce((sum: number, s: any) => sum + s.downloads, 0)}
            </div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider mt-0.5">
              Installs
            </div>
          </div>
          <div className="w-px h-6 bg-zinc-800" />
          <div>
            <div className="text-lg font-mono font-semibold text-white">
              Free
            </div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider mt-0.5">
              Open Source
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="border border-zinc-800/80 rounded-lg overflow-hidden bg-zinc-900/50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {query ? `Results for "${query}"` : 'Skills Leaderboard'}
            </h2>
            {query && (
              <span className="text-xs text-zinc-500">
                {pagination.total} found
              </span>
            )}
          </div>

          {/* Skills List */}
          {skills.length > 0 ? (
            <div>
              {skills.map((skill: any, index: number) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  rank={(page - 1) * 20 + index + 1}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-sm text-zinc-500">
                {query ? 'No skills found. Try a different search.' : 'No skills yet. Be the first to upload one!'}
              </p>
              {!query && (
                <a
                  href="/upload"
                  className="inline-block mt-4 text-sm px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-900 font-medium rounded-md transition-colors"
                >
                  Upload a Skill
                </a>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 mb-6 flex items-center justify-center gap-2">
            {page > 1 && (
              <a
                href={`/?${new URLSearchParams({ ...(query && { q: query }), page: (page - 1).toString() }).toString()}`}
                className="px-3 py-1.5 text-sm border border-zinc-700 rounded-md hover:bg-zinc-800 transition-colors text-zinc-300"
              >
                ← Prev
              </a>
            )}
            <span className="px-3 py-1.5 text-sm text-zinc-500 font-mono">
              {page} / {pagination.totalPages}
            </span>
            {page < pagination.totalPages && (
              <a
                href={`/?${new URLSearchParams({ ...(query && { q: query }), page: (page + 1).toString() }).toString()}`}
                className="px-3 py-1.5 text-sm border border-zinc-700 rounded-md hover:bg-zinc-800 transition-colors text-zinc-300"
              >
                Next →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
