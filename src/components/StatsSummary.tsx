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
      {/* Stars Card */}
      <div className="glass-panel p-5 rounded-3xl bg-gradient-to-br from-amber-500/5 to-yellow-500/3 dark:from-amber-500/5 dark:to-yellow-500/2 relative overflow-hidden group hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-500/5 dark:hover:shadow-yellow-500/10 transition-all duration-300">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-yellow-500/10 dark:bg-yellow-500/15 rounded-full transition-transform duration-500 group-hover:scale-150 blur-md"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-100/50 dark:bg-yellow-500/10 rounded-xl text-yellow-600 dark:text-yellow-400 transition-colors">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xs font-bold tracking-wider text-zinc-400 dark:text-zinc-400 uppercase">Total Stars</span>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">{stats.totalStars.toLocaleString()}</div>
        </div>
      </div>

      {/* Forks Card */}
      <div className="glass-panel p-5 rounded-3xl bg-gradient-to-br from-blue-500/5 to-cyan-500/3 dark:from-blue-500/5 dark:to-cyan-500/2 relative overflow-hidden group hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10 transition-all duration-300">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/10 dark:bg-blue-500/15 rounded-full transition-transform duration-500 group-hover:scale-150 blur-md"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100/50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 transition-colors">
              <GitFork className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold tracking-wider text-zinc-400 dark:text-zinc-400 uppercase">Total Forks</span>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">{stats.totalForks.toLocaleString()}</div>
        </div>
      </div>

      {/* Source Repos Card */}
      <div className="glass-panel p-5 rounded-3xl bg-gradient-to-br from-purple-500/5 to-pink-500/3 dark:from-purple-500/5 dark:to-pink-500/2 relative overflow-hidden group hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/5 dark:hover:shadow-purple-500/10 transition-all duration-300">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-500/10 dark:bg-purple-500/15 rounded-full transition-transform duration-500 group-hover:scale-150 blur-md"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100/50 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 transition-colors">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold tracking-wider text-zinc-400 dark:text-zinc-400 uppercase">Source Repos</span>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">{stats.repoCount}</div>
        </div>
      </div>

      {/* Top Project Card */}
      <div className="glass-panel p-5 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-teal-500/3 dark:from-emerald-500/5 dark:to-teal-500/2 relative overflow-hidden group hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5 dark:hover:shadow-emerald-500/10 transition-all duration-300">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full transition-transform duration-500 group-hover:scale-150 blur-md"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-100/50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 transition-colors">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold tracking-wider text-zinc-400 dark:text-zinc-400 uppercase">Top Project</span>
          </div>
          <div className="text-base font-extrabold text-zinc-900 dark:text-zinc-50 truncate tracking-tight" title={stats.mostPopular?.name || ''}>
            {stats.mostPopular?.name || 'N/A'}
          </div>
          <div className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 mt-1.5 uppercase tracking-widest">
            {stats.mostPopular?.stargazers_count?.toLocaleString() ?? 0} stars
          </div>
        </div>
      </div>
    </div>
  );
}
