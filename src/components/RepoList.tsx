import React, { useState, useMemo } from 'react';
import { GitHubRepo } from '../lib/github';
import { filterAndSortRepos } from '../lib/githubUtils';
import { Star, GitFork, Book, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RepoListProps {
  repos: GitHubRepo[];
  username: string;
}

export function RepoList({ repos, username }: RepoListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'stars' | 'updated'>('stars');
  const [repoType, setRepoType] = useState<'all' | 'personal' | 'org'>('all');
  const [language, setLanguage] = useState<string>('all');

  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach(repo => {
      if (repo.language && !repo.fork) {
        if (repoType === 'personal' && repo.owner && repo.owner.login.toLowerCase() !== username.toLowerCase()) return;
        if (repoType === 'org' && (!repo.owner || repo.owner.login.toLowerCase() === username.toLowerCase())) return;
        langs.add(repo.language);
      }
    });
    return Array.from(langs).sort();
  }, [repos, repoType, username]);

  const filteredAndSortedRepos = useMemo(() => {
    return filterAndSortRepos(repos, searchQuery, sortBy, repoType, username, language);
  }, [repos, searchQuery, sortBy, repoType, username, language]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:justify-between items-start xl:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          Repositories
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {filteredAndSortedRepos.length}
          </span>
        </h2>
        
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          <select
            value={repoType}
            onChange={(e) => { setRepoType(e.target.value as 'all' | 'personal' | 'org'); setLanguage('all'); }}
            className="px-3.5 py-2 border border-gray-200 rounded-xl text-sm font-medium bg-white text-gray-700 hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer transition-colors shadow-sm"
          >
            <option value="all">All Repositories</option>
            <option value="personal">Personal</option>
            <option value="org">Organizations</option>
          </select>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3.5 py-2 border border-gray-200 rounded-xl text-sm font-medium bg-white text-gray-700 hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer transition-colors shadow-sm"
          >
            <option value="all">All Languages</option>
            {availableLanguages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Find a repository..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full outline-none transition-all shadow-sm h-full"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'stars' | 'updated')}
            className="px-3.5 py-2 border border-gray-200 rounded-xl text-sm font-medium bg-white text-gray-700 hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer transition-colors shadow-sm"
          >
            <option value="stars">Sort by Stars</option>
            <option value="updated">Sort by Updated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredAndSortedRepos.map(repo => (
          <div key={repo.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col h-full group">
            <div className="flex justify-between items-start gap-4 mb-3">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                  <span className="truncate">{repo.name}</span>
                </a>
              </h3>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {!repo.owner || repo.owner.login.toLowerCase() === username.toLowerCase() ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                    Personal
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100/50">
                    Org
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-5 flex-grow line-clamp-2 leading-relaxed">
              {repo.description || <span className="italic text-gray-400">No description provided.</span>}
            </p>
            
            {repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {repo.topics.slice(0, 4).map(topic => (
                  <span key={topic} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-default">
                    {topic}
                  </span>
                ))}
                {repo.topics.length > 4 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-50 text-gray-600 cursor-default">
                    +{repo.topics.length - 4}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-auto pt-4 border-t border-gray-50 font-medium">
              {repo.language && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></span>
                  <span className="text-gray-700">{repo.language}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors" title="Stars">
                <Star className="w-4 h-4 text-gray-400" />
                <span>{repo.stargazers_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors" title="Forks">
                <GitFork className="w-4 h-4 text-gray-400" />
                <span>{repo.forks_count.toLocaleString()}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 ml-auto text-gray-400 text-right">
                <span title="Project Start Date">Started {new Date(repo.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                <span className="hidden sm:inline">&bull;</span>
                <span title="Last Updated">Updated {formatDistanceToNow(new Date(repo.updated_at))} ago</span>
              </div>
            </div>
          </div>
        ))}
        
        {filteredAndSortedRepos.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-2xl border border-gray-200 border-dashed">
            <Search className="w-10 h-10 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium text-lg">No repositories found matching your search.</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
}
