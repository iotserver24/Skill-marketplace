import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skills Marketplace - Share & Discover AI Coding Skills",
  description: "Community marketplace for AI coding assistant skills. Upload, discover, and download skills to enhance your AI-powered development workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Skills Marketplace
                </span>
              </a>
              <div className="flex items-center gap-4">
                <a
                  href="/"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                >
                  Browse
                </a>
                <a
                  href="/upload"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Upload Skill
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Skills Marketplace - Open source AI skill sharing platform</p>
              <p className="mt-2">
                <a href="/api/mcp/skills/search" className="text-blue-600 dark:text-blue-400 hover:underline">
                  MCP API
                </a>
                {' · '}
                <a href="https://github.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  GitHub
                </a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
