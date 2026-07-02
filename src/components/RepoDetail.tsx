import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, GitFork, Book, Calendar, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { GitHubRepo, fetchRepoReadme } from '../lib/github';

interface RepoDetailProps {
  repo: GitHubRepo;
  token?: string;
  onBack: () => void;
}

export function RepoDetail({ repo, token, onBack }: RepoDetailProps) {
  const [readme, setReadme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadReadme() {
      setLoading(true);
      setError(false);
      try {
        const data = await fetchRepoReadme(repo.owner.login, repo.name, token);
        if (active) {
          setReadme(data);
          setLoading(false);
        }
      } catch (e) {
        if (active) {
          setError(true);
          setLoading(false);
        }
      }
    }
    loadReadme();
    return () => {
      active = false;
    };
  }, [repo.owner.login, repo.name, token]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Back & Actions Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 dark:bg-zinc-950/20 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 border border-indigo-200/60 dark:border-zinc-850/80 rounded-xl bg-white/90 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm font-bold shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:focus-visible:ring-zinc-650"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl transition-all text-sm font-bold shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ml-auto sm:ml-0"
        >
          View on GitHub
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Main Repository Header Panel */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="p-2 bg-zinc-100/80 dark:bg-zinc-900/50 rounded-xl border border-zinc-200/30 dark:border-zinc-800/35 text-zinc-600 dark:text-zinc-400 shrink-0">
                <Book className="w-6 h-6" />
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight truncate" title={repo.name}>
                {repo.name}
              </h1>
              {repo.private && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 dark:border-amber-900/10 shrink-0">
                  Private
                </span>
              )}
            </div>
            
            {repo.description ? (
              <p className="text-zinc-600 dark:text-zinc-350 text-base leading-relaxed max-w-4xl font-medium">
                {repo.description}
              </p>
            ) : (
              <p className="italic text-zinc-400 dark:text-zinc-500 text-sm">
                No description provided.
              </p>
            )}

            {repo.topics && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {repo.topics.map(topic => (
                  <span key={topic} className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-900/50 text-zinc-650 dark:text-zinc-400 border border-zinc-200/20 dark:border-zinc-800/20">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stats Box */}
          <div className="flex gap-4.5 shrink-0 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-zinc-800/40 p-4 md:p-5 rounded-2xl backdrop-blur-sm md:flex-col lg:flex-row justify-around min-w-[200px]">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Star className="w-3.5 h-3.5 text-yellow-500" /> Stars
              </span>
              <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                {repo.stargazers_count.toLocaleString()}
              </span>
            </div>
            <div className="w-px md:w-full md:h-px lg:w-px lg:h-8 bg-zinc-200 dark:bg-zinc-800 self-stretch"></div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">
                <GitFork className="w-3.5 h-3.5 text-blue-500" /> Forks
              </span>
              <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                {repo.forks_count.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Technical Footer Row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6 pt-6 border-t border-zinc-200/50 dark:border-zinc-800/40 text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
          {repo.language && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500 shadow-sm"></span>
              <span className="text-zinc-700 dark:text-zinc-300 text-sm">{repo.language}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5" title="Project Creation Date">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <span>Created {new Date(repo.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Last Updated">
            <RefreshCw className="w-4.5 h-4.5 text-zinc-400 animate-hover-spin" />
            <span>Updated {formatDistanceToNow(new Date(repo.updated_at))} ago</span>
          </div>
        </div>
      </div>

      {/* README Render Section */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-6 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/40 flex items-center gap-2">
          Repository README
          {!loading && !error && readme !== null && (
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 border border-zinc-200/50 dark:border-zinc-800/40 px-2 py-0.5 rounded-lg flex items-center gap-1 shrink-0">
              ⚡ {Math.max(1, Math.ceil(readme.split(/\s+/).filter(Boolean).length / 200))} min read
            </span>
          )}
        </h2>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-zinc-400 animate-spin mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400 font-semibold animate-pulse">Fetching README content...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50/70 dark:bg-red-950/10 border border-red-200/50 dark:border-red-900/20 rounded-2xl p-6 text-center max-w-xl mx-auto backdrop-blur-md">
            <p className="text-red-700 dark:text-red-400 font-semibold mb-1">Failed to load README</p>
            <p className="text-red-500 dark:text-red-500 text-sm">There was an issue fetching the repository files from GitHub. Please check your network connection or API limits.</p>
          </div>
        )}

        {!loading && !error && readme === null && (
          <div className="bg-zinc-50/60 dark:bg-zinc-900/10 border border-zinc-200/50 dark:border-zinc-800/20 rounded-2xl p-8 text-center max-w-xl mx-auto backdrop-blur-md">
            <p className="text-zinc-700 dark:text-zinc-300 font-bold mb-1">No README found</p>
            <p className="text-zinc-500 dark:text-zinc-500 text-sm">This repository does not have a README file in its root branch.</p>
          </div>
        )}

        {!loading && !error && readme !== null && (
          <div className="w-full overflow-x-auto scrollbar-thin">
            <div className="markdown-body !bg-transparent text-zinc-800 dark:text-zinc-200" style={{ backgroundColor: 'transparent' }}>
              <Markdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw]}
                components={{
                  img: ({ node, ...props }) => (
                    <img 
                      {...props} 
                      style={{ maxWidth: '100%', borderRadius: '12px' }} 
                      referrerPolicy="no-referrer" 
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  )
                }}
              >
                {readme}
              </Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
