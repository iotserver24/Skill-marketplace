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
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center py-10 sm:py-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
            Discover AI Coding Skills
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Community-powered skills to enhance your AI development workflow
          </p>
          <SearchBar />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 mb-10 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {pagination.total}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Skills
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {skills.reduce((sum: number, s: any) => sum + s.downloads, 0)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Downloads
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Free
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Open Source
            </div>
          </div>
        </div>

        {/* Results */}
        {query && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Results for &quot;{query}&quot;
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {pagination.total} skill{pagination.total !== 1 ? 's' : ''} found
            </p>
          </div>
        )}

        {/* Skills Grid */}
        {skills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill: any) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-gray-500">
              {query ? 'No skills found. Try a different search.' : 'No skills yet. Be the first to upload one!'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-10 mb-6 flex items-center justify-center gap-2">
            {page > 1 && (
              <a
                href={`/?${new URLSearchParams({ ...(query && { q: query }), page: (page - 1).toString() }).toString()}`}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                ← Prev
              </a>
            )}
            <span className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400">
              {page} / {pagination.totalPages}
            </span>
            {page < pagination.totalPages && (
              <a
                href={`/?${new URLSearchParams({ ...(query && { q: query }), page: (page + 1).toString() }).toString()}`}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
