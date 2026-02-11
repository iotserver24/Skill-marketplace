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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              <a href="/" className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Skills Marketplace
                </span>
              </a>
              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href="/"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-1.5"
                >
                  Browse
                </a>
                <a
                  href="/upload"
                  className="text-sm px-3 py-1.5 bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium rounded-md transition-colors"
                >
                  Upload
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
          {children}
        </main>
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
              <p>Skills Marketplace — Open source AI skill sharing</p>
              <div className="flex items-center gap-4">
                <a href="/api/mcp/skills/search" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  MCP API
                </a>
                <a href="https://github.com" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
