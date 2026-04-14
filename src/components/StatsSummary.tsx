import React from 'react';
import { GitHubRepo } from '../lib/github';
import { calculateRepoStats } from '../lib/githubUtils';
import { Star, GitFork, Code2, Trophy } from 'lucide-react';

interface StatsSummaryProps {
  repos: GitHubRepo[];
}

export function StatsSummary({ repos }: StatsSummaryProps) {
  const stats = React.useMemo(() => {
    return calculateRepoStats(repos);
  }, [repos]);

  if (stats.repoCount === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-yellow-50 rounded-lg">
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
          <span className="text-sm font-medium text-gray-500">Total Stars</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">{stats.totalStars.toLocaleString()}</div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <GitFork className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-500">Total Forks</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">{stats.totalForks.toLocaleString()}</div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Code2 className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-gray-500">Source Repos</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">{stats.repoCount}</div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-50 rounded-lg">
            <Trophy className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-sm font-medium text-gray-500">Top Project</span>
        </div>
        <div className="text-sm font-bold text-gray-900 truncate">
          {stats.mostPopular?.name || 'N/A'}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {stats.mostPopular?.stargazers_count.toLocaleString()} stars
        </div>
      </div>
    </div>
  );
}
