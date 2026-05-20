import React from 'react';
import { GitHubOrg } from '../lib/github';
import { Building2 } from 'lucide-react';

interface OrganizationsProps {
  orgs: GitHubOrg[];
}

export function Organizations({ orgs }: OrganizationsProps) {
  if (orgs.length === 0) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl h-full">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
        Organizations
      </h3>
      <div className="flex flex-wrap gap-4">
        {orgs.map(org => (
          <a
            key={org.id}
            href={`https://github.com/${org.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-3 p-2 pr-4 rounded-xl border border-zinc-150/60 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-zinc-800/40 transition-all cursor-pointer"
            title={org.login}
          >
            <img
              src={org.avatar_url}
              alt={org.login}
              className="w-10 h-10 rounded-lg shadow-sm bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50"
              referrerPolicy="no-referrer"
            />
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{org.login}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
