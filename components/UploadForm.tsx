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
    <div className="max-w-lg mx-auto">
      {result && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
            ✅ Uploaded successfully
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300 mb-2">
            {result.skill.name}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {result.skill.categories.map((cat: string) => (
              <span key={cat} className="px-2 py-0.5 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 text-xs rounded-md">
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
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Skill File (.md) <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept=".md"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 dark:file:bg-gray-700 dark:file:text-gray-200 hover:file:bg-gray-200 dark:hover:file:bg-gray-600 file:cursor-pointer file:transition-colors"
            required
          />
          {file && (
            <p className="mt-1.5 text-xs text-gray-500">{file.name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent text-gray-900 dark:text-gray-100"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Your Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent text-gray-900 dark:text-gray-100"
              placeholder="john@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            About You <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={authorDescription}
            onChange={(e) => setAuthorDescription(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent text-gray-900 dark:text-gray-100"
            placeholder="Full-stack developer specializing in React..."
            rows={2}
            maxLength={500}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Skill Name <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent text-gray-900 dark:text-gray-100"
            placeholder="Leave empty — AI will suggest one"
          />
        </div>

        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full px-4 py-2.5 bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-200 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white dark:text-gray-900 text-sm font-medium rounded-lg transition-colors"
        >
          {uploading ? 'Processing with AI...' : 'Upload Skill'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">What happens next?</h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• AI analyzes your skill and extracts metadata</li>
          <li>• Security scan removes any sensitive information</li>
          <li>• Skill gets categorized and tagged automatically</li>
          <li>• Your skill becomes searchable in the marketplace</li>
        </ul>
      </div>
    </div>
  );
}
