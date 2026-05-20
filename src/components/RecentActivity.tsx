import React, { useState } from 'react';
import { GitHubEvent } from '../lib/github';
import { formatDistanceToNow } from 'date-fns';
import { GitCommit, GitPullRequest, CircleDot, Star, FolderPlus, ChevronDown, ChevronUp } from 'lucide-react';

interface RecentActivityProps {
  events: GitHubEvent[];
}

export function RecentActivity({ events }: RecentActivityProps) {
  if (!events || events.length === 0) return null;

  // Filter to the most relevant events to keep the feed clean
  const filteredEvents = events.filter(e => 
    ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'WatchEvent', 'CreateEvent'].includes(e.type)
  ).slice(0, 8);

  if (filteredEvents.length === 0) return null;

  const renderEvent = (event: GitHubEvent) => {
    switch (event.type) {
      case 'PushEvent': {
        const commits = event.payload?.size || event.payload?.commits?.length || 0;
        return (
          <>
            <div className="p-2 bg-green-50 dark:bg-green-500/10 ring-4 ring-white dark:ring-zinc-900 rounded-full text-green-600 dark:text-green-400 shadow-sm z-10 shrink-0">
              <GitCommit className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 pt-1.5">
              <p className="text-sm text-zinc-800 dark:text-zinc-200">
                {commits > 0 ? (
                  <>Pushed {commits} commit{commits !== 1 ? 's' : ''} to </>
                ) : (
                  <>Pushed to </>
                )}
                <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-450 break-words">{event.repo.name}</a>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{formatDistanceToNow(new Date(event.created_at))} ago</p>
            </div>
          </>
        );
      }
      case 'PullRequestEvent': {
        const action = event.payload.action;
        return (
          <>
            <div className="p-2 bg-purple-50 dark:bg-purple-500/10 ring-4 ring-white dark:ring-zinc-900 rounded-full text-purple-600 dark:text-purple-400 shadow-sm z-10 shrink-0">
              <GitPullRequest className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 pt-1.5">
              <p className="text-sm text-zinc-800 dark:text-zinc-200">
                <span className="capitalize">{action}</span> a pull request in <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-450 break-words">{event.repo.name}</a>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{formatDistanceToNow(new Date(event.created_at))} ago</p>
            </div>
          </>
        );
      }
      case 'IssuesEvent': {
        return (
          <>
            <div className="p-2 bg-orange-50 dark:bg-orange-500/10 ring-4 ring-white dark:ring-zinc-900 rounded-full text-orange-600 dark:text-orange-400 shadow-sm z-10 shrink-0">
              <CircleDot className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 pt-1.5">
              <p className="text-sm text-zinc-800 dark:text-zinc-200">
                <span className="capitalize">{event.payload.action}</span> an issue in <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-450 break-words">{event.repo.name}</a>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{formatDistanceToNow(new Date(event.created_at))} ago</p>
            </div>
          </>
        );
      }
      case 'WatchEvent': {
        return (
          <>
            <div className="p-2 bg-yellow-50 dark:bg-yellow-500/10 ring-4 ring-white dark:ring-zinc-900 rounded-full text-yellow-600 dark:text-yellow-400 shadow-sm z-10 shrink-0">
              <Star className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 pt-1.5">
              <p className="text-sm text-zinc-800 dark:text-zinc-200">
                Starred <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-450 break-words">{event.repo.name}</a>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{formatDistanceToNow(new Date(event.created_at))} ago</p>
            </div>
          </>
        );
      }
      case 'CreateEvent': {
        return (
          <>
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 ring-4 ring-white dark:ring-zinc-900 rounded-full text-blue-600 dark:text-blue-400 shadow-sm z-10 shrink-0">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 pt-1.5">
              <p className="text-sm text-zinc-800 dark:text-zinc-200">
                Created a new {event.payload.ref_type} in <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-450 break-words">{event.repo.name}</a>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{formatDistanceToNow(new Date(event.created_at))} ago</p>
            </div>
          </>
        );
      }
      default:
        return null;
    }
  };

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="glass-panel rounded-3xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <CircleDot className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
          Activity Feed
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 border border-indigo-200/50 dark:border-zinc-800/80 rounded-xl bg-white/70 dark:bg-zinc-900/30 text-zinc-505 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:focus-visible:ring-zinc-650"
          title={isExpanded ? "Collapse Section" : "Expand Section"}
          aria-label={isExpanded ? "Collapse Activity Feed" : "Expand Activity Feed"}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className={`transition-all duration-300 ease-in-out origin-top overflow-hidden ${
        isExpanded ? "opacity-100 max-h-[800px]" : "opacity-0 max-h-0 pointer-events-none -mb-6"
      }`}>
        <div className="space-y-6 relative flex-1 before:absolute before:inset-y-0 before:left-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200/60 dark:before:via-zinc-800/40 before:to-transparent pt-2">
          {filteredEvents.map((event) => (
            <div key={event.id} className="relative flex items-start gap-4">
              {renderEvent(event)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
