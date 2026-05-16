import React from 'react';
import { GitHubUser, GitHubSocialAccount } from '../lib/github';
import { Users, MapPin, Link as LinkIcon, Twitter, Building, Calendar, Globe } from 'lucide-react';
import { format } from 'date-fns';

interface GitHubProfileProps {
  user: GitHubUser;
  socials: GitHubSocialAccount[];
}

export function GitHubProfile({ user, socials }: GitHubProfileProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100"></div>
      
      <div className="relative mt-4 mb-4">
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="w-full relative z-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name || user.login}</h1>
        <a 
          href={user.html_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-base text-gray-500 hover:text-blue-600 transition-colors font-medium mb-4 inline-block"
        >
          @{user.login}
        </a>

        {user.bio && (
          <p className="text-gray-700 text-sm mb-6 leading-relaxed">
            {user.bio}
          </p>
        )}

        <div className="flex justify-center gap-6 mb-6 text-sm text-gray-600 border-y border-gray-100 py-4 w-full">
          <div className="flex flex-col items-center">
            <span className="font-bold text-gray-900 text-lg">{user.followers.toLocaleString()}</span> 
            <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Followers</span>
          </div>
          <div className="w-px bg-gray-100"></div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-gray-900 text-lg">{user.following.toLocaleString()}</span> 
            <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Following</span>
          </div>
        </div>

        <div className="w-full flex justify-center mb-6">
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
          >
            View on GitHub
          </a>
        </div>

        <div className="flex flex-col gap-y-3 text-sm text-gray-600 w-full text-left bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          {user.company && (
            <div className="flex items-center gap-3">
              <Building className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate" title={user.company}>{user.company}</span>
            </div>
          )}
          {user.location && (
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate" title={user.location}>{user.location}</span>
            </div>
          )}
          {user.blog && (
            <div className="flex items-center gap-3">
              <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
              <a 
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 hover:underline truncate"
                title={user.blog}
              >
                {user.blog}
              </a>
            </div>
          )}
          {user.twitter_username && (
            <div className="flex items-center gap-3">
              <Twitter className="w-4 h-4 text-gray-400 shrink-0" />
              <a 
                href={`https://twitter.com/${user.twitter_username}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 hover:underline truncate"
              >
                @{user.twitter_username}
              </a>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">Joined {format(new Date(user.created_at), 'MMMM yyyy')}</span>
          </div>
          
          {socials.map((social) => (
             <div key={social.url} className="flex items-center gap-3">
               <Globe className="w-4 h-4 text-gray-400 shrink-0" />
               <a 
                 href={social.url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="hover:text-blue-600 hover:underline capitalize truncate"
               >
                 {social.provider}
               </a>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
