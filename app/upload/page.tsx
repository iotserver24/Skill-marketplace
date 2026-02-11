import UploadForm from '@/components/UploadForm';

export const metadata = {
  title: 'Upload Skill - Skills Marketplace',
  description: 'Share your AI coding skill with the community',
};

export default function UploadPage() {
  return (
    <div className="px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
            Upload a Skill
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Share your expertise with the community
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-800">
          <UploadForm />
        </div>

        <div className="mt-8 mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              📋 Good Skills
            </h3>
            <ul className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <li>✓ Clear AI instructions</li>
              <li>✓ Focused on specific tasks</li>
              <li>✓ Includes examples</li>
              <li>✓ Well-structured</li>
            </ul>
          </div>

          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              🤖 AI Processing
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Claude AI extracts metadata, categorizes content, and scans for sensitive information automatically.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              💡 Examples
            </h3>
            <ul className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
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
