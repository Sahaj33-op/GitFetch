import React, { useState } from 'react';
import { Search, Github, Loader2, AlertCircle, Download, Copy, Check, Key } from 'lucide-react';
import { GitHubProfile } from './components/GitHubProfile';
import { ProfileReadme } from './components/ProfileReadme';
import { RepoList } from './components/RepoList';
import { StatsSummary } from './components/StatsSummary';
import { TopLanguages } from './components/TopLanguages';
import { Organizations } from './components/Organizations';
import { RecentActivity } from './components/RecentActivity';
import { ExportModal } from './components/ExportModal';
import { generateMarkdown, downloadMarkdown, MarkdownExportOptions } from './lib/markdownExport';
import { useGitHubProfile } from './hooks/useGitHubProfile';

export default function App() {
  const [searchParams, setSearchParams] = useState({ username: '', token: '' });
  const [searchInput, setSearchInput] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  const { user, repos, readme, orgs, socials, events, loading, error, warnings } = useGitHubProfile(searchParams.username, searchParams.token);

  const handleCopyMarkdown = async (options: MarkdownExportOptions) => {
    if (!user) return;
    const md = generateMarkdown(user, repos, readme, orgs, socials, events, options);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = (options: MarkdownExportOptions) => {
    if (!user) return;
    const md = generateMarkdown(user, repos, readme, orgs, socials, events, options);
    downloadMarkdown(md, `${user.login}-profile.md`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchParams({ username: searchInput.trim(), token: tokenInput.trim() });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Github className="w-8 h-8 text-gray-900" />
              <span className="text-xl font-bold tracking-tight">GitHub Profile Extractor</span>
            </div>
            
            <form onSubmit={handleSearch} className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 relative group">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="GitHub username..."
                  className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                />
              </div>
              <div className="relative flex-grow group/token">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-gray-400 group-focus-within/token:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="PAT (optional)"
                  className="block w-full sm:w-48 pl-9 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                />
                <div className="absolute top-full mt-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover/token:opacity-100 group-hover/token:visible transition-all z-20 tooltip">
                  <p className="font-semibold mb-1">Personal Access Token</p>
                  <p className="text-gray-300">Add a GitHub PAT to increase rate limits, fetch private repositories, and load SAML/SSO organization data.</p>
                </div>
              </div>
              <button type="submit" className="sr-only">Search</button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!searchParams.username && !loading && !error && (
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
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium animate-pulse">Extracting profile data...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <h3 className="text-lg font-semibold text-red-800 mb-1">Error fetching profile</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {warnings && warnings.length > 0 && !loading && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 max-w-7xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <AlertCircle className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-800 mb-2">Some data could not be fetched</h3>
                <div className="text-amber-700 text-sm space-y-2 text-left">
                  <ul className="list-disc pl-5 space-y-1">
                    {warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                  {warnings.some(w => w.includes('403')) && (
                    <div className="mt-3 bg-amber-100/50 p-3 rounded-lg border border-amber-200/60 font-medium">
                      <p className="mb-1 text-xs text-amber-800 font-semibold tracking-wide uppercase">Trouble fetching Org data?</p>
                      <p className="text-amber-800/90 leading-relaxed">
                        If you are using a Personal Access Token (PAT), organization data might be protected by SAML Single Sign-On. 
                        You must explicitly authorize your PAT for SSO in GitHub. 
                        Go to <strong>Settings &gt; Developer settings &gt; Personal access tokens</strong>, target your token, and click <strong>Configure SSO</strong>.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {user && !loading && (
          <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sidebar */}
            <aside className="w-full lg:w-1/3 xl:w-1/4 space-y-6 shrink-0">
              <GitHubProfile user={user} socials={socials} />
              <div className="hidden lg:block space-y-6">
                {orgs.length > 0 && <Organizations orgs={orgs} />}
              </div>
            </aside>

            {/* Main Content */}
            <div className="w-full lg:w-2/3 xl:w-3/4 space-y-8 min-w-0">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Dashboard Overview</h2>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Export Markdown
                </button>
              </div>

              <StatsSummary repos={repos} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TopLanguages repos={repos} />
                <RecentActivity events={events} />
              </div>
              
              <div className="block lg:hidden">
                {orgs.length > 0 && <Organizations orgs={orgs} />}
              </div>
              
              {readme && (
                <ProfileReadme content={readme} />
              )}
              
              <RepoList repos={repos} username={user.login} />
            </div>
          </div>
        )}
      </main>

      <ExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)}
        onCopy={handleCopyMarkdown}
        onDownload={handleDownloadMarkdown}
        copied={copied}
      />
    </div>
  );
}
