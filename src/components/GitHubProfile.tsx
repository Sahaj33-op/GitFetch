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
    <div className="glass-panel rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-b border-zinc-200/20 dark:border-zinc-800/10"></div>
      
      <div className="relative mt-4 mb-4">
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="w-32 h-32 rounded-full border-4 border-white/80 dark:border-zinc-950/80 shadow-lg bg-white dark:bg-zinc-900"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="w-full relative z-10">
        {user.name && user.name.toLowerCase() !== user.login.toLowerCase() ? (
          <>
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-0.5">{user.name}</h1>
            <a 
              href={user.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition-all font-semibold mb-4 inline-block"
            >
              @{user.login}
            </a>
          </>
        ) : (
          <a 
            href={user.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-all mb-4 inline-block"
          >
            @{user.login}
          </a>
        )}

        {user.bio && (
          <p className="text-zinc-600 dark:text-zinc-300 text-sm mb-6 leading-relaxed">
            {user.bio}
          </p>
        )}

        <div className="flex justify-center gap-6 mb-6 text-sm text-zinc-600 dark:text-zinc-400 border-y border-zinc-200/50 dark:border-zinc-800/40 py-4.5 w-full">
          <div className="flex flex-col items-center">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xl">{user.followers.toLocaleString()}</span> 
            <span className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-wider font-semibold mt-0.5">Followers</span>
          </div>
          <div className="w-px bg-zinc-200/50 dark:bg-zinc-800/40"></div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xl">{user.following.toLocaleString()}</span> 
            <span className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-wider font-semibold mt-0.5">Following</span>
          </div>
        </div>

        <div className="w-full flex justify-center mb-6">
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-200 hover:scale-[1.02] active:scale-[0.98] text-white dark:text-zinc-950 rounded-xl transition-all font-bold text-sm shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:ring-offset-2"
          >
            View on GitHub
          </a>
        </div>

        <div className="flex flex-col gap-y-3.5 text-sm text-zinc-600 dark:text-zinc-300 w-full text-left bg-white/30 dark:bg-zinc-950/20 p-4 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/30 backdrop-blur-md">
          {user.company && (
            <div className="flex items-center gap-3">
              <Building className="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
              <span className="truncate text-zinc-700 dark:text-zinc-300 font-medium" title={user.company}>{user.company}</span>
            </div>
          )}
          {user.location && (
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
              <span className="truncate text-zinc-700 dark:text-zinc-300 font-medium" title={user.location}>{user.location}</span>
            </div>
          )}
          {user.blog && (
            <div className="flex items-center gap-3">
              <LinkIcon className="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
              <a 
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline truncate text-zinc-700 dark:text-zinc-300 font-medium"
                title={user.blog}
              >
                {user.blog}
              </a>
            </div>
          )}
          {user.twitter_username && (
            <div className="flex items-center gap-3">
              <Twitter className="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
              <a 
                href={`https://twitter.com/${user.twitter_username}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline truncate text-zinc-700 dark:text-zinc-300 font-medium"
              >
                @{user.twitter_username}
              </a>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
            <span className="truncate text-zinc-700 dark:text-zinc-300 font-medium">Joined {format(new Date(user.created_at), 'MMMM yyyy')}</span>
          </div>
          
          {socials.map((social) => (
             <div key={social.url} className="flex items-center gap-3">
               <Globe className="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
               <a 
                 href={social.url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline capitalize truncate text-zinc-700 dark:text-zinc-300 font-medium"
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
