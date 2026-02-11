'use client';

import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorDescription, setAuthorDescription] = useState('');
  const [skillName, setSkillName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.md')) {
        setError('Please select a .md (Markdown) file');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      // Read file content
      const content = await file.text();

      // Send to API
      const response = await fetch('/api/skills/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          authorName,
          authorEmail,
          authorDescription,
          skillName: skillName || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setResult(data);
      
      // Reset form
      setFile(null);
      setAuthorName('');
      setAuthorEmail('');
      setAuthorDescription('');
      setSkillName('');
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {result && (
        <div className="mb-6 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            ✅ Skill Uploaded Successfully!
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300 mb-2">
            <strong>{result.skill.name}</strong>
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mb-3">
            {result.skill.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {result.skill.categories.map((cat: string) => (
              <span key={cat} className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded">
                {cat}
              </span>
            ))}
          </div>
          <a
            href={`/skills/${result.skillId}`}
            className="text-sm text-green-700 dark:text-green-300 underline hover:no-underline"
          >
            View your skill →
          </a>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Skill File (.md) *
          </label>
          <input
            type="file"
            accept=".md"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Selected: {file.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Your Name *
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Your Email *
          </label>
          <input
            type="email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            About You (Optional)
          </label>
          <textarea
            value={authorDescription}
            onChange={(e) => setAuthorDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Full-stack developer specializing in React..."
            rows={3}
            maxLength={500}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Skill Name (Optional)
          </label>
          <input
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="AI will suggest one if left empty"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Leave empty to let AI suggest a name based on content
          </p>
        </div>

        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
        >
          {uploading ? 'Processing with AI...' : 'Upload Skill'}
        </button>
      </form>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-semibold mb-2">What happens next?</h4>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>• AI analyzes your skill and extracts metadata</li>
          <li>• Security scan removes any sensitive information</li>
          <li>• Skill gets categorized and tagged automatically</li>
          <li>• Your skill becomes searchable in the marketplace</li>
        </ul>
      </div>
    </div>
  );
}
