export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          404
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Skill not found
        </p>
        <a
          href="/"
          className="inline-block px-4 py-2 bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-200 text-white dark:text-gray-900 text-sm font-medium rounded-lg transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
