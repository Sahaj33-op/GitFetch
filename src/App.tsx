import React, { useState } from 'react';
import { Search, Github, Loader2, AlertCircle, Download, Copy, Check } from 'lucide-react';
import { GitHubProfile } from './components/GitHubProfile';
import { ProfileReadme } from './components/ProfileReadme';
import { RepoList } from './components/RepoList';
import { StatsSummary } from './components/StatsSummary';
import { TopLanguages } from './components/TopLanguages';
import { Organizations } from './components/Organizations';
import { generateMarkdown, downloadMarkdown } from './lib/markdownExport';
import { useGitHubProfile } from './hooks/useGitHubProfile';

export default function App() {
  const [username, setUsername] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [copied, setCopied] = useState(false);
  
  const { user, repos, readme, orgs, socials, loading, error } = useGitHubProfile(username);

  const handleCopyMarkdown = async () => {
    if (!user) return;
    const md = generateMarkdown(user, repos, readme, orgs, socials);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!user) return;
    const md = generateMarkdown(user, repos, readme, orgs, socials);
    downloadMarkdown(md, `${user.login}-profile.md`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setUsername(searchInput.trim());
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Github className="w-8 h-8 text-gray-900" />
              <span className="text-xl font-bold tracking-tight">GitHub Profile Extractor</span>
            </div>
            
            <form onSubmit={handleSearch} className="w-full sm:w-auto relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {loading ? <Loader2 className="h-5 w-5 text-blue-500 animate-spin" /> : <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />}
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter GitHub username..."
                aria-label="Search GitHub username"
                disabled={loading}
                className="block w-full sm:w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button type="submit" className="sr-only" disabled={loading}>Search</button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!username && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Github className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Search for a GitHub User</h2>
            <p className="text-gray-500 max-w-md">
              Enter a GitHub username above to extract their full profile, including their README, repositories, and stats.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600 font-medium animate-pulse">Extracting profile data...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <h3 className="text-lg font-semibold text-red-800 mb-1">Error fetching profile</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {user && !loading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Markdown'}
              </button>
              <button
                onClick={handleDownloadMarkdown}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download Markdown
              </button>
            </div>

            <GitHubProfile user={user} socials={socials} />

            <StatsSummary repos={repos} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TopLanguages repos={repos} />
              <Organizations orgs={orgs} />
            </div>
            
            {readme && (
              <ProfileReadme content={readme} />
            )}
            
            <RepoList repos={repos} />
          </div>
        )}
      </main>
    </div>
  );
}
