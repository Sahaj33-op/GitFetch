import React, { useState, useMemo } from 'react';
import { GitHubRepo } from '../lib/github';
import { filterAndSortRepos } from '../lib/githubUtils';
import { Star, GitFork, Book, Search, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  Swift: '#F05138',
  Shell: '#89e051',
  PHP: '#4F5D95',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
};

interface RepoListProps {
  repos: GitHubRepo[];
  username: string;
  onSelectRepo: (repo: GitHubRepo) => void;
}

export function RepoList({ repos, username, onSelectRepo }: RepoListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'stars' | 'updated'>('stars');
  const [repoType, setRepoType] = useState<'all' | 'personal' | 'org'>('all');
  const [language, setLanguage] = useState<string>('all');
  const [visibility, setVisibility] = useState<'all' | 'public' | 'private'>('all');

  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach(repo => {
      if (repo.language && !repo.fork) {
        if (repoType === 'personal' && repo.owner && repo.owner.login.toLowerCase() !== username.toLowerCase()) return;
        if (repoType === 'org' && (!repo.owner || repo.owner.login.toLowerCase() === username.toLowerCase())) return;
        if (visibility === 'public' && repo.private) return;
        if (visibility === 'private' && !repo.private) return;
        langs.add(repo.language);
      }
    });
    return Array.from(langs).sort();
  }, [repos, repoType, visibility, username]);

  const filteredAndSortedRepos = useMemo(() => {
    return filterAndSortRepos(repos, searchQuery, sortBy, repoType, username, language, visibility);
  }, [repos, searchQuery, sortBy, repoType, username, language, visibility]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:justify-between items-start xl:items-center gap-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          Repositories
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-200/50 dark:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200 border border-zinc-200/20 dark:border-zinc-800/10">
            {filteredAndSortedRepos.length}
          </span>
        </h2>
        
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          <select
            value={repoType}
            onChange={(e) => { setRepoType(e.target.value as 'all' | 'personal' | 'org'); setLanguage('all'); }}
            className="px-3.5 py-2.5 border border-indigo-200/60 dark:border-zinc-800/80 rounded-xl text-sm font-semibold bg-white/90 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 hover:border-indigo-300 dark:hover:border-zinc-700 focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-400 outline-none cursor-pointer transition-all shadow-sm backdrop-blur-md"
          >
            <option value="all">All Repositories</option>
            <option value="personal">Personal</option>
            <option value="org">Organizations</option>
          </select>

          <select
            value={visibility}
            onChange={(e) => { setVisibility(e.target.value as 'all' | 'public' | 'private'); setLanguage('all'); }}
            className="px-3.5 py-2.5 border border-indigo-200/60 dark:border-zinc-800/80 rounded-xl text-sm font-semibold bg-white/90 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 hover:border-indigo-300 dark:hover:border-zinc-700 focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-400 outline-none cursor-pointer transition-all shadow-sm backdrop-blur-md"
          >
            <option value="all">Any Visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <div className="relative flex items-center shrink-0">
            {language !== 'all' && (
              <span 
                className="absolute left-3.5 w-2.5 h-2.5 rounded-full z-10 transition-all shadow-sm" 
                style={{ backgroundColor: LANGUAGE_COLORS[language] || '#9ca3af' }}
              />
            )}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`py-2.5 border border-indigo-200/60 dark:border-zinc-800/80 rounded-xl text-sm font-semibold bg-white/90 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 hover:border-indigo-300 dark:hover:border-zinc-700 focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-400 outline-none cursor-pointer transition-all shadow-sm backdrop-blur-md ${
                language !== 'all' ? 'pl-8 pr-3.5' : 'px-3.5'
              }`}
            >
              <option value="all">All Languages</option>
              {availableLanguages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Find a repository..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 border border-indigo-200/60 dark:border-zinc-800/60 rounded-xl text-sm bg-white/90 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-400 w-full outline-none transition-all shadow-sm h-full backdrop-blur-md"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'stars' | 'updated')}
            className="px-3.5 py-2.5 border border-indigo-200/60 dark:border-zinc-800/80 rounded-xl text-sm font-semibold bg-white/90 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 hover:border-indigo-300 dark:hover:border-zinc-700 focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-400 outline-none cursor-pointer transition-all shadow-sm backdrop-blur-md"
          >
            <option value="stars">Sort by Stars</option>
            <option value="updated">Sort by Updated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredAndSortedRepos.map(repo => (
          <div key={repo.id} className="glass-panel rounded-3xl p-6 flex flex-col h-full group relative overflow-hidden">
            <div className="flex justify-between items-start gap-4 mb-3">
              <div className="flex items-center gap-2 truncate">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-slate-350 transition-colors truncate">
                  <button 
                    onClick={() => onSelectRepo(repo)} 
                    className="flex items-center gap-2 cursor-pointer text-left hover:underline focus:outline-none w-full"
                  >
                    <Book className="w-5 h-5 text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 dark:group-hover:text-slate-350 transition-colors flex-shrink-0" />
                    <span className="truncate">{repo.name}</span>
                  </button>
                </h3>
                <a 
                  href={repo.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all shrink-0 focus-visible:outline-none"
                  title="Open on GitHub"
                  aria-label={`Open ${repo.name} on GitHub`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex gap-1">
                  {repo.private && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-amber-500/10 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 dark:border-amber-900/10">
                      Private
                    </span>
                  )}
                  {!repo.owner || repo.owner.login.toLowerCase() === username.toLowerCase() ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-300 border border-zinc-200/20 dark:border-zinc-800/10">
                      Personal
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-purple-500/10 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border border-purple-500/20 dark:border-purple-900/10">
                      Org
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-zinc-600 dark:text-zinc-300 text-sm mb-5 flex-grow line-clamp-2 leading-relaxed font-medium">
              {repo.description || <span className="italic text-zinc-400 dark:text-zinc-500 font-normal">No description provided.</span>}
            </p>
            
            {repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {repo.topics.slice(0, 4).map(topic => (
                  <span key={topic} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/5 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 hover:bg-blue-500/10 dark:hover:bg-blue-900/30 transition-colors cursor-default">
                    {topic}
                  </span>
                ))}
                {repo.topics.length > 4 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-default">
                    +{repo.topics.length - 4}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 mt-auto pt-4 border-t border-zinc-200/50 dark:border-zinc-800/40 font-medium">
              {repo.language && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></span>
                  <span className="text-zinc-700 dark:text-zinc-300">{repo.language}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors cursor-pointer" title="Stars">
                <Star className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <span>{repo.stargazers_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors cursor-pointer" title="Forks">
                <GitFork className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <span>{repo.forks_count.toLocaleString()}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 ml-auto text-zinc-400 dark:text-zinc-500 text-right">
                <span title="Project Start Date">Started {new Date(repo.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                <span className="hidden sm:inline">&bull;</span>
                <span title="Last Updated">Updated {formatDistanceToNow(new Date(repo.updated_at))} ago</span>
              </div>
            </div>
          </div>
        ))}
        
        {filteredAndSortedRepos.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white/40 dark:bg-zinc-900/10 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/40 border-dashed">
            <Search className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mb-4" />
            <p className="text-zinc-700 dark:text-zinc-300 font-bold text-lg">No repositories found matching your search.</p>
            <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-1">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
}
