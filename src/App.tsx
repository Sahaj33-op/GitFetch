import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Github, Loader2, AlertCircle, Download, Copy, Check, Key, Sun, Moon } from 'lucide-react';
import { GitHubProfile } from './components/GitHubProfile';
import { ProfileReadme } from './components/ProfileReadme';
import { RepoList } from './components/RepoList';
import { StatsSummary } from './components/StatsSummary';
import { TopLanguages } from './components/TopLanguages';
import { Organizations } from './components/Organizations';
import { RecentActivity } from './components/RecentActivity';
import { ExportModal } from './components/ExportModal';
import { Chatbot } from './components/Chatbot';
import { AIPortfolioCTA } from './components/AIPortfolioCTA';
import { generateMarkdown, downloadMarkdown, MarkdownExportOptions } from './lib/markdownExport';
import { useGitHubProfile } from './hooks/useGitHubProfile';
import { fetchRepoReadme, fetchRateLimit, RateLimit } from './lib/github';
import { RepoDetail } from './components/RepoDetail';

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
        <div className="relative flex-grow group/search">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Search className="h-5 w-5 md:h-4 md:w-4 text-zinc-500 dark:text-zinc-400 group-focus-within/search:text-indigo-550 dark:group-focus-within/search:text-indigo-400 transition-colors" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="GitHub username..."
            aria-label="GitHub username"
          className="block w-full md:w-56 lg:w-64 pl-10 pr-3 py-2.5 md:py-2 border border-indigo-200/70 dark:border-zinc-800/50 rounded-xl bg-white/90 dark:bg-zinc-950/30 backdrop-blur-md placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-950/80 focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all text-base md:text-sm text-zinc-900 dark:text-zinc-50 shadow-sm"
          />
        </div>
        <button 
          type="button"
          onClick={() => setShowToken(!showToken)}
          className={`md:hidden flex flex-shrink-0 items-center justify-center px-3 border border-indigo-200/60 dark:border-zinc-800/50 rounded-xl transition-all shadow-sm ${showToken ? 'bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100' : 'bg-white/90 dark:bg-zinc-950/30 backdrop-blur-md text-zinc-500 dark:text-zinc-400'}`}
          aria-label="Toggle token input"
        >
          <Key className="w-5 h-5" />
        </button>
        <button 
          type="submit" 
          className="md:hidden flex flex-shrink-0 items-center justify-center px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          aria-label="Extract Profile"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      <div className={`${showToken ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-2 w-full md:w-auto`}>
        <div className="relative flex-grow group/token">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Key className="h-4 w-4 text-zinc-500 dark:text-zinc-400 group-focus-within/token:text-indigo-550 dark:group-focus-within/token:text-blue-400 transition-colors" />
          </div>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="PAT (optional)"
            aria-label="GitHub Personal Access Token (optional)"
            className="block w-full md:w-44 lg:w-48 pl-9 pr-3 py-2.5 md:py-2 border border-indigo-200/70 dark:border-zinc-800/50 rounded-xl bg-white/90 dark:bg-zinc-950/30 backdrop-blur-md placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-950/80 focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all text-base md:text-sm text-zinc-900 dark:text-zinc-50 shadow-sm"
          />
          
          {/* Desktop Tooltip */}
          <div className="hidden md:block absolute top-[calc(100%+0.5rem)] right-0 w-72 p-4 bg-white/95 dark:bg-zinc-950/95 border border-zinc-200/60 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs rounded-xl opacity-0 invisible group-hover/token:opacity-100 group-hover/token:visible transition-all z-50 shadow-xl backdrop-blur-md">
            <p className="font-bold mb-1 text-sm">Personal Access Token</p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">Add a GitHub PAT to increase rate limits, fetch private repositories, organizations and contributions.</p>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded p-2.5 mb-2">
              <p className="text-amber-700 dark:text-amber-300 font-semibold leading-tight mb-1">Note: A 7-day PAT token with <code className="bg-amber-500/20 px-1 rounded font-mono text-[10px]">read:org</code> scope is needed to fetch SAML/SSO organizations.</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded p-2.5">
              <p className="text-amber-700 dark:text-amber-300 font-semibold leading-tight">Security Note: Your PAT is never stored on our servers. Use a fine-grained read-only token. Do not enter broad-scope or long-lived tokens.</p>
            </div>
          </div>
        </div>
        
        {/* Mobile token note */}
        <div className="md:hidden text-xs text-zinc-500 dark:text-zinc-400 bg-amber-50/50 dark:bg-amber-950/15 border border-amber-200/50 dark:border-amber-900/30 p-3 rounded-lg w-full">
          <p className="font-bold text-amber-800 dark:text-amber-400 mb-1 text-sm">PAT Token (Optional)</p>
          <p className="mb-2">Increases rate limits & fetches private repos, orgs & contributions.</p>
          <p className="font-semibold text-amber-700 dark:text-amber-500 mb-2">Note: A 7-day PAT token with <code className="bg-amber-500/20 px-1 rounded font-mono text-[10px]">read:org</code> scope is needed to fetch some organizations.</p>
          <p className="font-semibold text-amber-800 dark:text-amber-400">Security Note: Your PAT is never stored on our servers. Use a fine-grained read-only token.</p>
        </div>
        
        <button 
          type="submit" 
          className="hidden md:flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 active:scale-[0.97] text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 dark:shadow-blue-400/10 hover:shadow-lg hover:shadow-blue-500/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 cursor-pointer font-bold"
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
  const [selectedRepoName, setSelectedRepoName] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [rateLimit, setRateLimit] = useState<RateLimit | null>(null);
  
  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const { user, repos, readme, orgs, socials, events, loading, error, warnings } = useGitHubProfile(searchParams.username, searchParams.token);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchParams(prev => ({ ...prev, username: params.get('username') || '' }));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    async function updateRateLimit() {
      const limitInfo = await fetchRateLimit(searchParams.token);
      setRateLimit(limitInfo);
    }
    updateRateLimit();
    const interval = setInterval(updateRateLimit, 60000);
    return () => clearInterval(interval);
  }, [searchParams.token, searchParams.username]);

  const fetchExportRepoReadmes = async (options: MarkdownExportOptions): Promise<Record<string, string | null>> => {
    const repoReadmes: Record<string, string | null> = {};
    if (!options.includeRepoReadmes || !repos) return repoReadmes;
    
    let sourceRepos = options.excludeForks ? repos.filter(r => !r.fork) : repos;
    if (!options.includePrivateRepos) {
      sourceRepos = sourceRepos.filter(r => !r.private);
    }
    
    const reposToFetch = [...sourceRepos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 20);

    setIsExporting(true);
    try {
      await Promise.all(
        reposToFetch.map(async (repo) => {
          try {
            const readmeText = await fetchRepoReadme(repo.owner.login, repo.name, searchParams.token);
            repoReadmes[repo.name] = readmeText;
          } catch (e) {
            repoReadmes[repo.name] = null;
          }
        })
      );
    } catch (e) {
      // ignore
    } finally {
      setIsExporting(false);
      const limitInfo = await fetchRateLimit(searchParams.token);
      setRateLimit(limitInfo);
    }
    return repoReadmes;
  };

  const handleCopyMarkdown = async (options: MarkdownExportOptions) => {
    if (!user) return;
    const repoReadmes = await fetchExportRepoReadmes(options);
    const md = generateMarkdown(user, repos, readme, orgs, socials, events, options, repoReadmes);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = async (options: MarkdownExportOptions) => {
    if (!user) return;
    const repoReadmes = await fetchExportRepoReadmes(options);
    const md = generateMarkdown(user, repos, readme, orgs, socials, events, options, repoReadmes);
    downloadMarkdown(md, `${user.login}-profile.md`);
  };

  const handleSearch = (username: string, token: string) => {
    setSearchParams({ username, token });
    setSelectedRepoName(null);
    const url = new URL(window.location.href);
    if (username) {
      url.searchParams.set('username', username);
    } else {
      url.searchParams.delete('username');
    }
    window.history.pushState({}, '', url);
  };

  const handleGoHome = () => {
    setSearchParams({ username: '', token: '' });
    setSelectedRepoName(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('username');
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
    <div className="relative overflow-x-clip min-h-screen bg-transparent text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-200 dark:selection:bg-blue-900/50 transition-colors duration-300">
      {/* Fixed static background elements (Prevents document-level scroll repaints) */}
      <div className="fixed inset-0 pointer-events-none -z-20 transition-colors duration-300 bg-[#eef0ff] dark:bg-[#030712] transform-gpu">
        {/* Light Mode: Multi-stop linear gradient & subtle indigo dot grid */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0f4ff] via-[#e8eeff] to-[#fce7f3] opacity-100 dark:opacity-0 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.05)_1.5px,transparent_1.5px)] dark:hidden bg-[size:24px_24px]" />
        
        {/* Dark Mode: Dual-size silver/zinc radial dot grid */}
        <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(rgba(148,163,184,0.03)_1.5px,transparent_1.5px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(rgba(244,244,245,0.015)_1px,transparent_1px)] bg-[size:12px_12px]" />
      </div>

      {/* Ambient glassmorphic glowing mesh circles (Viewport locked with GPU layer cache caching) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 transform-gpu will-change-transform">
        <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] bg-gradient-to-br from-blue-400/25 to-cyan-400/15 dark:from-slate-650/8 dark:to-zinc-700/4 rounded-full blur-[100px] animate-glow-1 will-change-transform" style={{ backfaceVisibility: 'hidden' } as React.CSSProperties} />
        <div className="absolute top-[35%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-gradient-to-br from-violet-400/20 to-pink-400/12 dark:from-zinc-750/6 dark:to-slate-850/3 rounded-full blur-[90px] animate-glow-2 will-change-transform" style={{ backfaceVisibility: 'hidden' } as React.CSSProperties} />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] max-w-[750px] max-h-[750px] bg-gradient-to-br from-indigo-400/25 to-purple-400/15 dark:from-slate-700/8 dark:to-zinc-800/4 rounded-full blur-[110px] pointer-events-none animate-glow-3 will-change-transform" style={{ backfaceVisibility: 'hidden' } as React.CSSProperties} />
        <div className="absolute top-[60%] left-[-5%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-gradient-to-br from-fuchsia-400/12 to-rose-400/8 dark:from-zinc-800/4 dark:to-slate-900/2 rounded-full blur-[80px] pointer-events-none animate-glow-2 will-change-transform" style={{ backfaceVisibility: 'hidden' } as React.CSSProperties} />
      </div>

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
      <header className="bg-white/55 dark:bg-zinc-950/60 backdrop-blur-xl border-b border-indigo-200/40 dark:border-zinc-900/40 sticky top-0 z-40 transition-all duration-300 shadow-sm shadow-indigo-100/50 dark:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-3.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <button 
              onClick={handleGoHome}
              className="flex items-center gap-2 cursor-pointer focus:outline-none hover:opacity-85 active:scale-[0.98] transition-all text-left bg-transparent border-0 p-0"
              title="Back to Homepage"
            >
              <Github className="w-6 h-6 md:w-8 md:h-8 text-zinc-900 dark:text-zinc-50" />
              <span className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 dark:from-zinc-50 dark:via-zinc-200 dark:to-zinc-300 bg-clip-text text-transparent">GitHub Profile Extractor</span>
            </button>
            
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <SearchForm onSearch={handleSearch} initialValue={searchParams.username} />
              
              {rateLimit && (
                <div 
                  className="group relative flex items-center gap-1.5 px-3 py-2 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl bg-white/90 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-350 cursor-default select-none text-xs font-bold shadow-sm backdrop-blur-md shrink-0"
                >
                  <span className={`w-2 h-2 rounded-full ${
                    rateLimit.remaining > 20 
                      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                      : rateLimit.remaining > 5 
                        ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                        : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                  }`}></span>
                  <span>API: {rateLimit.remaining}/{rateLimit.limit}</span>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute top-[calc(100%+0.5rem)] right-0 w-64 p-3 bg-white/95 dark:bg-zinc-950/95 border border-zinc-200/60 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-[11px] rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl leading-relaxed">
                    <p className="font-bold mb-0.5 text-xs text-zinc-900 dark:text-zinc-50">GitHub API Rate Limit</p>
                    <p className="text-zinc-500 dark:text-zinc-400">Core endpoints remaining. Resets at <strong className="text-zinc-700 dark:text-zinc-200">{new Date(rateLimit.reset * 1000).toLocaleTimeString()}</strong>.</p>
                    {rateLimit.limit === 60 && (
                      <p className="mt-1.5 text-amber-600 dark:text-amber-400 font-semibold">Tip: Supply a Personal Access Token (PAT) in the search options to increase limit to 5,000/hr.</p>
                    )}
                  </div>
                </div>
              )}
              
              <a
                href="https://github.com/Sahaj33-op/GitFetch.git"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 md:p-2.5 border border-indigo-200/60 dark:border-zinc-800/80 rounded-xl bg-white/90 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-800/80 hover:scale-[1.03] active:scale-[0.97] transition-all text-zinc-600 dark:text-zinc-300 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:focus-visible:ring-zinc-600 shadow-sm"
                title="View GitHub Repository"
                aria-label="View GitHub Repository"
              >
                <Github className="w-5 h-5 md:w-4.5 md:h-4.5" />
              </a>

              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2.5 md:p-2.5 border border-indigo-200/60 dark:border-zinc-800/80 rounded-xl bg-white/90 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-800/80 hover:scale-[1.03] active:scale-[0.97] transition-all text-zinc-600 dark:text-zinc-300 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:focus-visible:ring-zinc-600 shadow-sm"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'light' ? <Moon className="w-5 h-5 md:w-4.5 md:h-4.5" /> : <Sun className="w-5 h-5 md:w-4.5 md:h-4.5" />}
              </button>
            </div>
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
          <div className="bg-red-50/70 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/30 rounded-xl p-6 flex flex-col items-center justify-center text-center max-w-2xl mx-auto backdrop-blur-md">
            <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400 mb-3" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-1">Error fetching profile</h3>
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </div>
        )}

        {warnings && warnings.length > 0 && !loading && (
          <div className="bg-amber-50/70 dark:bg-amber-950/15 border border-amber-200/80 dark:border-amber-900/30 rounded-xl p-5 mb-8 max-w-7xl mx-auto backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <AlertCircle className="w-6 h-6 text-amber-500 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">Some data could not be fetched</h3>
                <div className="text-amber-750 dark:text-amber-300 text-sm space-y-2 text-left">
                  <ul className="list-disc pl-5 space-y-1">
                    {warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                  {warnings.some(w => w.includes('403')) && (
                    <div className="mt-3 bg-amber-100/50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200/60 dark:border-amber-900/20 font-medium">
                      <p className="mb-1 text-xs text-amber-800 dark:text-amber-300 font-semibold tracking-wide uppercase">Trouble fetching Org data?</p>
                      <p className="text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
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
              {selectedRepoName && repos.find(r => r.name === selectedRepoName) ? (
                <RepoDetail 
                  repo={repos.find(r => r.name === selectedRepoName)!} 
                  token={searchParams.token}
                  onBack={() => setSelectedRepoName(null)}
                />
              ) : (
                <>
                  <div className="flex justify-between items-center glass-panel p-4 rounded-xl">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-200">Dashboard Overview</h2>
                    <button
                      onClick={() => setShowExportModal(true)}
                      aria-label="Export profile to markdown"
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-950 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 rounded-lg transition-colors text-sm font-semibold shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
                    >
                      <Download className="w-4 h-4" />
                      Export Markdown
                    </button>
                  </div>

                  <AIPortfolioCTA 
                    user={user} 
                    repos={repos} 
                    readme={readme} 
                    orgs={orgs} 
                    socials={socials} 
                    events={events} 
                  />

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
                  
                  <RepoList 
                    repos={repos} 
                    username={user.login} 
                    onSelectRepo={(repo) => setSelectedRepoName(repo.name)} 
                  />
                </>
              )}
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
      {isExporting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <Loader2 className="w-12 h-12 text-zinc-400 dark:text-zinc-150 animate-spin mb-4" />
          <p className="text-zinc-205 dark:text-zinc-100 font-bold text-lg animate-pulse">Fetching Repository READMEs...</p>
          <p className="text-zinc-400 dark:text-zinc-400 text-sm mt-1">This may take a few seconds to retrieve from GitHub.</p>
        </div>
      )}
    </div>
  );
}
