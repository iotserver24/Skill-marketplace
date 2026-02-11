import UploadForm from '@/components/UploadForm';

export const metadata = {
  title: 'Upload Skill - Skills Marketplace',
  description: 'Share your AI coding skill with the community',
};

export default function UploadPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Upload a Skill
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Share your expertise with the community. Upload a skill and help others code better with AI.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
          <UploadForm />
        </div>

        <div className="mt-12 space-y-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-3">
              📋 What makes a good skill?
            </h3>
            <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-300">
              <li>✓ Clear, specific instructions for the AI</li>
              <li>✓ Focused on a specific framework, language, or task</li>
              <li>✓ Includes examples and best practices</li>
              <li>✓ Well-structured with headings and sections</li>
              <li>✓ Free of personal/sensitive information</li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-3">
              🤖 AI Processing
            </h3>
            <p className="text-sm text-purple-800 dark:text-purple-300">
              Your skill will be analyzed by Claude AI to extract metadata, categorize content, 
              and perform security scanning. Any sensitive information will be automatically removed 
              to keep the marketplace safe.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
              💡 Example Use Cases
            </h3>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
              <li>• React best practices and conventions</li>
              <li>• Python FastAPI development patterns</li>
              <li>• TailwindCSS component templates</li>
              <li>• Testing strategies for TypeScript</li>
              <li>• SQL query optimization techniques</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
