import React from 'react';
import { GitHubOrg } from '../lib/github';
import { Building2 } from 'lucide-react';

interface OrganizationsProps {
  orgs: GitHubOrg[];
}

export function Organizations({ orgs }: OrganizationsProps) {
  if (orgs.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-gray-400" />
        Organizations
      </h3>
      <div className="flex flex-wrap gap-4">
        {orgs.map(org => (
          <a
            key={org.id}
            href={`https://github.com/${org.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-3 p-2 pr-4 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all"
            title={org.login}
          >
            <img
              src={org.avatar_url}
              alt={org.login}
              className="w-10 h-10 rounded-lg shadow-sm bg-white"
              referrerPolicy="no-referrer"
            />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">{org.login}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
