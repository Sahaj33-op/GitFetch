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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-yellow-50 rounded-full transition-transform group-hover:scale-150"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-100/50 rounded-xl text-yellow-600">
              <Star className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">Total Stars</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 tracking-tight">{stats.totalStars.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-50 rounded-full transition-transform group-hover:scale-150"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100/50 rounded-xl text-blue-600">
              <GitFork className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">Total Forks</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 tracking-tight">{stats.totalForks.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-50 rounded-full transition-transform group-hover:scale-150"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100/50 rounded-xl text-purple-600">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">Source Repos</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 tracking-tight">{stats.repoCount}</div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-50 rounded-full transition-transform group-hover:scale-150"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-100/50 rounded-xl text-emerald-600">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">Top Project</span>
          </div>
          <div className="text-base font-bold text-gray-900 truncate tracking-tight" title={stats.mostPopular?.name || ''}>
            {stats.mostPopular?.name || 'N/A'}
          </div>
          <div className="text-xs font-medium text-emerald-600 mt-1 uppercase tracking-widest">
            {stats.mostPopular?.stargazers_count?.toLocaleString() ?? 0} stars
          </div>
        </div>
      </div>
    </div>
  );
}
