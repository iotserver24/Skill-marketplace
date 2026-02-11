export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-2 font-mono">
          404
        </h1>
        <p className="text-zinc-500 mb-6">
          Skill not found
        </p>
        <a
          href="/"
          className="inline-block px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-900 text-sm font-medium rounded-lg transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
