import React, { useState, useMemo } from 'react';
import { GitHubRepo } from '../lib/github';
import { filterAndSortRepos } from '../lib/githubUtils';
import { Star, GitFork, Book, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RepoListProps {
  repos: GitHubRepo[];
}

export function RepoList({ repos }: RepoListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'stars' | 'updated'>('stars');

  const filteredAndSortedRepos = useMemo(() => {
    return filterAndSortRepos(repos, searchQuery, sortBy);
  }, [repos, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Repositories <span className="text-gray-500 text-lg font-normal">({repos.filter(r => !r.fork).length} public sources)</span>
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Find a repository..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Find a repository"
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64 outline-none transition-all"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'stars' | 'updated')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
          >
            <option value="stars">Sort by Stars</option>
            <option value="updated">Sort by Updated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAndSortedRepos.map(repo => (
          <div key={repo.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors flex flex-col h-full">
            <div className="flex justify-between items-start gap-4 mb-2">
              <h3 className="text-lg font-semibold text-blue-600 hover:underline truncate">
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Book className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{repo.name}</span>
                </a>
              </h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                Public
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
              {repo.description || <span className="italic text-gray-400">No description provided.</span>}
            </p>
            
            {repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {repo.topics.slice(0, 4).map(topic => (
                  <span key={topic} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {topic}
                  </span>
                ))}
                {repo.topics.length > 4 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                    +{repo.topics.length - 4} more
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
              {repo.language && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>{repo.language}</span>
                </div>
              )}
              <div className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                <Star className="w-3.5 h-3.5" />
                <span>{repo.stargazers_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                <GitFork className="w-3.5 h-3.5" />
                <span>{repo.forks_count.toLocaleString()}</span>
              </div>
              <div className="ml-auto">
                Updated {formatDistanceToNow(new Date(repo.updated_at))} ago
              </div>
            </div>
          </div>
        ))}
        
        {filteredAndSortedRepos.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
            No repositories found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
