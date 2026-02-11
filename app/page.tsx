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
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Discover AI Coding Skills
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Community-powered skills to enhance your AI development workflow
          </p>
          <SearchBar />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {pagination.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total Skills
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {skills.reduce((sum: number, s: any) => sum + s.downloads, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Downloads
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              Free
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              & Open Source
            </div>
          </div>
        </div>

        {/* Results */}
        {query && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Search results for &quot;{query}&quot;
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Found {pagination.total} skill{pagination.total !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Skills Grid */}
        {skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill: any) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {query ? 'No skills found. Try a different search term.' : 'No skills yet. Be the first to upload one!'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {page > 1 && (
              <a
                href={`/?${new URLSearchParams({ ...(query && { q: query }), page: (page - 1).toString() }).toString()}`}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Previous
              </a>
            )}
            <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
              Page {page} of {pagination.totalPages}
            </span>
            {page < pagination.totalPages && (
              <a
                href={`/?${new URLSearchParams({ ...(query && { q: query }), page: (page + 1).toString() }).toString()}`}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Next
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
