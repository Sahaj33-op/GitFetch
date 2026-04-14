import React from 'react';
import { GitHubOrg } from '../lib/github';

interface OrganizationsProps {
  orgs: GitHubOrg[];
}

export function Organizations({ orgs }: OrganizationsProps) {
  if (orgs.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizations</h3>
      <div className="flex flex-wrap gap-4">
        {orgs.map(org => (
          <a
            key={org.id}
            href={`https://github.com/${org.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
            title={org.login}
          >
            <img
              src={org.avatar_url}
              alt={org.login}
              className="w-12 h-12 rounded-lg border border-gray-100 group-hover:border-blue-500 transition-colors"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {org.login}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
