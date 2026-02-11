import UploadForm from '@/components/UploadForm';

export const metadata = {
  title: 'Upload Skill - Skills Marketplace',
  description: 'Share your AI coding skill with the community',
};

export default function UploadPage() {
  return (
    <div className="px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center pt-12 pb-8 sm:pt-16 sm:pb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
            Upload a Skill
          </h1>
          <p className="text-sm text-zinc-400">
            Share your expertise with the community
          </p>
        </div>

        <div className="border border-zinc-800/80 rounded-lg bg-zinc-900/50 p-6 sm:p-8">
          <UploadForm />
        </div>

        <div className="mt-8 mb-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 border border-zinc-800/80 rounded-lg">
            <h3 className="text-sm font-medium text-zinc-200 mb-2">
              📋 Good Skills
            </h3>
            <ul className="space-y-1 text-xs text-zinc-500">
              <li>✓ Clear AI instructions</li>
              <li>✓ Focused on specific tasks</li>
              <li>✓ Includes examples</li>
              <li>✓ Well-structured</li>
            </ul>
          </div>

          <div className="p-4 border border-zinc-800/80 rounded-lg">
            <h3 className="text-sm font-medium text-zinc-200 mb-2">
              🤖 AI Processing
            </h3>
            <p className="text-xs text-zinc-500">
              Claude AI extracts metadata, categorizes content, and scans for sensitive information automatically.
            </p>
          </div>

          <div className="p-4 border border-zinc-800/80 rounded-lg">
            <h3 className="text-sm font-medium text-zinc-200 mb-2">
              💡 Examples
            </h3>
            <ul className="space-y-1 text-xs text-zinc-500">
              <li>• React best practices</li>
              <li>• Python API patterns</li>
              <li>• Testing strategies</li>
              <li>• SQL optimization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
