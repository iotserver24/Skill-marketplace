import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

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
    <html lang="en" className="dark">
      <body className="antialiased bg-zinc-950 text-zinc-100">
        <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-lg">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-lg">🎯</span>
                <span className="text-base font-semibold text-white">
                  Skills Marketplace
                </span>
              </a>
              <div className="flex items-center gap-1">
                <a
                  href="/"
                  className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-zinc-800/60"
                >
                  Browse
                </a>
                <a
                  href="/upload"
                  className="text-sm px-3 py-1.5 bg-white hover:bg-zinc-200 text-zinc-900 font-medium rounded-md transition-colors"
                >
                  Upload
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="border-t border-zinc-800/80 mt-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
              <p>Skills Marketplace — Open source AI skill sharing</p>
              <div className="flex items-center gap-4">
                <a href="/api/mcp/skills/search" className="hover:text-zinc-300 transition-colors">
                  MCP API
                </a>
                <a href="https://github.com" className="hover:text-zinc-300 transition-colors">
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
