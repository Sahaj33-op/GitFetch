import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Github, Loader2, AlertCircle, Download, Copy, Check, Key } from 'lucide-react';
import { GitHubProfile } from './components/GitHubProfile';
import { ProfileReadme } from './components/ProfileReadme';
import { RepoList } from './components/RepoList';
import { StatsSummary } from './components/StatsSummary';
import { TopLanguages } from './components/TopLanguages';
import { Organizations } from './components/Organizations';
import { RecentActivity } from './components/RecentActivity';
import { ExportModal } from './components/ExportModal';
import { Chatbot } from './components/Chatbot';
import { generateMarkdown, downloadMarkdown, MarkdownExportOptions } from './lib/markdownExport';
import { useGitHubProfile } from './hooks/useGitHubProfile';

import { LandingContent } from './components/LandingContent';

function SearchForm({ onSearch, initialValue = '' }: { onSearch: (username: string, token: string) => void, initialValue?: string }) {
  const [searchInput, setSearchInput] = useState(initialValue);
  const [tokenInput, setTokenInput] = useState('');
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    setSearchInput(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    onSearch(searchInput.trim(), tokenInput.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-auto flex flex-col md:flex-row gap-2 relative">
      <div className="flex w-full gap-2 md:w-auto">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 md:h-4 md:w-4 text-gray-400 transition-colors" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="GitHub username..."
            aria-label="GitHub username"
            className="block w-full md:w-56 lg:w-64 pl-10 pr-3 py-2.5 md:py-2 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base md:text-sm"
          />
        </div>
        <button 
          type="button"
          onClick={() => setShowToken(!showToken)}
          className={`md:hidden flex flex-shrink-0 items-center justify-center px-3 border border-gray-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${showToken ? 'bg-gray-200' : 'bg-gray-50 text-gray-600'}`}
          aria-label="Toggle token input"
        >
          <Key className="w-5 h-5" />
        </button>
        <button 
          type="submit" 
          className="md:hidden flex flex-shrink-0 items-center justify-center px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
          aria-label="Extract Profile"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      <div className={`${showToken ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-2 w-full md:w-auto`}>
        <div className="relative flex-grow group/token">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Key className="h-4 w-4 text-gray-400 group-focus-within/token:text-blue-500 transition-colors" />
          </div>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="PAT (optional)"
            aria-label="GitHub Personal Access Token (optional)"
            className="block w-full md:w-44 lg:w-48 pl-9 pr-3 py-2.5 md:py-2 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base md:text-sm"
          />
          
          {/* Desktop Tooltip */}
          <div className="hidden md:block absolute top-[calc(100%+0.5rem)] right-0 w-72 p-4 bg-gray-900 border border-gray-700 text-white text-xs rounded-lg opacity-0 invisible group-hover/token:opacity-100 group-hover/token:visible transition-all z-50 shadow-xl">
            <div className="absolute -top-2 right-6 w-4 h-4 bg-gray-900 border-t border-l border-gray-700 transform rotate-45"></div>
            <p className="font-semibold mb-1 text-sm">Personal Access Token</p>
            <p className="text-gray-300 leading-relaxed mb-3">Add a GitHub PAT to increase rate limits, fetch private repositories, organizations and contributions.</p>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded p-2.5">
              <p className="text-amber-200 font-medium leading-tight">Note: A 7-day PAT token with <code className="bg-amber-500/20 px-1 rounded font-mono text-[10px]">read:org</code> scope is needed to fetch SAML/SSO organizations.</p>
            </div>
          </div>
        </div>
        
        {/* Mobile token note */}
        <div className="md:hidden text-xs text-gray-600 bg-amber-50 border border-amber-200 p-3 rounded-lg w-full">
          <p className="font-semibold text-amber-800 mb-1 text-sm">PAT Token (Optional)</p>
          <p className="mb-2">Increases rate limits & fetches private repos, orgs & contributions.</p>
          <p className="font-medium text-amber-700">Note: A 7-day PAT token with <code className="bg-amber-500/20 px-1 rounded font-mono text-[10px]">read:org</code> scope is needed to fetch some organizations.</p>
        </div>
        
        <button 
          type="submit" 
          className="hidden md:flex items-center justify-center gap-2 px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
        >
          <span className="text-sm">Extract</span>
        </button>
      </div>
    </form>
  );
}

export default function App() {
  const getInitialParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      username: params.get('username') || '',
      token: ''
    };
  };

  const [searchParams, setSearchParams] = useState(getInitialParams());
  const [copied, setCopied] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  const { user, repos, readme, orgs, socials, events, loading, error, warnings } = useGitHubProfile(searchParams.username, searchParams.token);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchParams(prev => ({ ...prev, username: params.get('username') || '' }));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  const handleSearch = (username: string, token: string) => {
    setSearchParams({ username, token });
    const url = new URL(window.location.href);
    if (username) {
      url.searchParams.set('username', username);
    } else {
      url.searchParams.delete('username');
    }
    window.history.pushState({}, '', url);
  };

  const seoTitle = user 
    ? `${user.name || user.login}'s GitHub Profile | GitHub Profile Extractor` 
    : 'GitHub Profile Extractor';
  const seoDescription = user 
    ? (user.bio ? user.bio.substring(0, 160) : `View ${user.name || user.login}'s rich GitHub profile, repository stats, top languages, and activity summary.`)
    : 'A beautifully designed, modern web application to extract, visualize, and export GitHub user profiles seamlessly.';

  const jsonLd = user ? {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": user.name || user.login,
    "url": window.location.href,
    "image": user.avatar_url,
    "sameAs": [
      user.html_url,
      ...socials.map(s => s.url)
    ].filter(Boolean),
    "description": seoDescription,
    "worksFor": user.company ? {
      "@type": "Organization",
      "name": user.company
    } : undefined
  } : null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-blue-100">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="title" content={seoTitle} />
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        {user?.avatar_url && <meta property="og:image" content={user.avatar_url} />}
        <meta property="og:type" content="profile" />
        {user?.name && <meta property="profile:first_name" content={user.name} />}
        {user?.login && <meta property="profile:username" content={user.login} />}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={seoTitle} />
        <meta property="twitter:description" content={seoDescription} />
        {user?.avatar_url && <meta property="twitter:image" content={user.avatar_url} />}
        <link rel="canonical" href={window.location.href} />
        {jsonLd && (
          <script type="application/ld+json">
            {JSON.stringify(jsonLd)}
          </script>
        )}
      </Helmet>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              <Github className="w-6 h-6 md:w-8 md:h-8 text-gray-900" />
              <span className="text-lg md:text-xl font-bold tracking-tight">GitHub Profile Extractor</span>
            </div>
            
            <SearchForm onSearch={handleSearch} initialValue={searchParams.username} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {!searchParams.username && !loading && !error && (
          <LandingContent />
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
                  aria-label="Export profile to markdown"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
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
      {user && !loading && (
        <Chatbot profileData={{ user, repos, readme, events, orgs }} />
      )}
    </div>
  );
}
