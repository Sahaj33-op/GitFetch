import React from 'react';
import { GitHubEvent } from '../lib/github';
import { formatDistanceToNow } from 'date-fns';
import { GitCommit, GitPullRequest, CircleDot, Star, FolderPlus } from 'lucide-react';

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
        const commits = event.payload.commits?.length || 0;
        return (
          <>
            <div className="p-2 bg-green-50 ring-4 ring-white rounded-full text-green-600 shadow-sm z-10 shrink-0">
              <GitCommit className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 pt-1.5">
              <p className="text-sm text-gray-800">
                Pushed {commits} commit{commits !== 1 ? 's' : ''} to <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-blue-600 break-words">{event.repo.name}</a>
              </p>
              <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(event.created_at))} ago</p>
            </div>
          </>
        );
      }
      case 'PullRequestEvent': {
        const action = event.payload.action;
        return (
          <>
            <div className="p-2 bg-purple-50 ring-4 ring-white rounded-full text-purple-600 shadow-sm z-10 shrink-0">
              <GitPullRequest className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 pt-1.5">
              <p className="text-sm text-gray-800">
                <span className="capitalize">{action}</span> a pull request in <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-blue-600 break-words">{event.repo.name}</a>
              </p>
              <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(event.created_at))} ago</p>
            </div>
          </>
        );
      }
      case 'IssuesEvent': {
        return (
          <>
            <div className="p-2 bg-orange-50 ring-4 ring-white rounded-full text-orange-600 shadow-sm z-10 shrink-0">
              <CircleDot className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 pt-1.5">
              <p className="text-sm text-gray-800">
                <span className="capitalize">{event.payload.action}</span> an issue in <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-blue-600 break-words">{event.repo.name}</a>
              </p>
              <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(event.created_at))} ago</p>
            </div>
          </>
        );
      }
      case 'WatchEvent': {
        return (
          <>
            <div className="p-2 bg-yellow-50 ring-4 ring-white rounded-full text-yellow-600 shadow-sm z-10 shrink-0">
              <Star className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 pt-1.5">
              <p className="text-sm text-gray-800">
                Starred <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-blue-600 break-words">{event.repo.name}</a>
              </p>
              <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(event.created_at))} ago</p>
            </div>
          </>
        );
      }
      case 'CreateEvent': {
        return (
          <>
            <div className="p-2 bg-blue-50 ring-4 ring-white rounded-full text-blue-600 shadow-sm z-10 shrink-0">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 pt-1.5">
              <p className="text-sm text-gray-800">
                Created a new {event.payload.ref_type} in <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-blue-600 break-words">{event.repo.name}</a>
              </p>
              <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(event.created_at))} ago</p>
            </div>
          </>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-hidden h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <CircleDot className="w-5 h-5 text-gray-400" />
        Activity Feed
      </h3>
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-100 before:to-transparent">
        {filteredEvents.map((event, i) => (
          <div key={event.id} className="relative flex items-start gap-4">
            <div className="hidden md:block w-px h-full bg-gray-100 absolute left-[1.15rem] top-8 -z-10 last:hidden"></div>
            {renderEvent(event)}
          </div>
        ))}
      </div>
    </div>
  );
}
