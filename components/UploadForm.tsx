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

  const inputClass = "w-full px-3 py-2 text-sm border border-zinc-700/80 rounded-lg bg-zinc-900 focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 text-zinc-100 placeholder:text-zinc-500 outline-none transition-colors";

  return (
    <div className="max-w-lg mx-auto">
      {result && (
        <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-lg">
          <h3 className="text-sm font-semibold text-emerald-300 mb-1">
            ✅ Uploaded successfully
          </h3>
          <p className="text-sm text-emerald-400 mb-2">
            <strong>{result.skill.name}</strong>
          </p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {result.skill.categories.map((cat: string) => (
              <span key={cat} className="px-2 py-0.5 bg-emerald-900/40 text-emerald-400 text-xs rounded-md">
                {cat}
              </span>
            ))}
          </div>
          <a
            href={`/skills/${result.skillId}`}
            className="text-sm text-emerald-400 underline hover:no-underline"
          >
            View your skill →
          </a>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 bg-red-950/40 border border-red-800/50 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Skill File (.md) <span className="text-red-400">*</span>
          </label>
          <input
            type="file"
            accept=".md"
            onChange={handleFileChange}
            className="w-full text-sm text-zinc-400 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 file:cursor-pointer file:transition-colors"
            required
          />
          {file && (
            <p className="mt-1.5 text-xs text-zinc-500">{file.name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Your Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className={inputClass}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Your Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              className={inputClass}
              placeholder="john@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            About You <span className="text-zinc-600 font-normal">(optional)</span>
          </label>
          <textarea
            value={authorDescription}
            onChange={(e) => setAuthorDescription(e.target.value)}
            className={inputClass}
            placeholder="Full-stack developer specializing in React..."
            rows={2}
            maxLength={500}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Skill Name <span className="text-zinc-600 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className={inputClass}
            placeholder="Leave empty — AI will suggest one"
          />
        </div>

        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full px-4 py-2.5 bg-white hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-900 text-sm font-medium rounded-lg transition-colors"
        >
          {uploading ? 'Processing with AI...' : 'Upload Skill'}
        </button>
      </form>

      <div className="mt-6 p-4 border border-zinc-800/80 rounded-lg">
        <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">What happens next?</h4>
        <ul className="text-sm text-zinc-400 space-y-1">
          <li>• AI analyzes your skill and extracts metadata</li>
          <li>• Security scan removes any sensitive information</li>
          <li>• Skill gets categorized and tagged automatically</li>
          <li>• Your skill becomes searchable in the marketplace</li>
        </ul>
      </div>
    </div>
  );
}
