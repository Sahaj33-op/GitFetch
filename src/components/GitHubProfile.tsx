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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
      <div className="flex-shrink-0">
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-gray-50 shadow-sm"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="flex-grow w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name || user.login}</h1>
            <a 
              href={user.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xl text-gray-500 hover:text-blue-600 transition-colors"
            >
              @{user.login}
            </a>
          </div>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
          >
            View on GitHub
          </a>
        </div>

        {user.bio && (
          <p className="text-gray-700 text-lg mb-6 max-w-3xl leading-relaxed mx-auto md:mx-0">
            {user.bio}
          </p>
        )}

        <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-1.5 font-medium text-gray-900">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{user.followers.toLocaleString()}</span> <span className="text-gray-500 font-normal">followers</span>
            <span className="mx-1 text-gray-300">•</span>
            <span>{user.following.toLocaleString()}</span> <span className="text-gray-500 font-normal">following</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-600">
          {user.company && (
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Building className="w-4 h-4" />
              <span>{user.company}</span>
            </div>
          )}
          {user.location && (
            <div className="flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
          )}
          {user.blog && (
            <div className="flex items-center justify-center md:justify-start gap-2">
              <LinkIcon className="w-4 h-4" />
              <a 
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 hover:underline truncate max-w-[200px]"
              >
                {user.blog}
              </a>
            </div>
          )}
          {user.twitter_username && (
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Twitter className="w-4 h-4" />
              <a 
                href={`https://twitter.com/${user.twitter_username}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 hover:underline"
              >
                @{user.twitter_username}
              </a>
            </div>
          )}
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Calendar className="w-4 h-4" />
            <span>Joined {format(new Date(user.created_at), 'MMMM yyyy')}</span>
          </div>
          
          {socials.map((social) => (
            <div key={social.url} className="flex items-center justify-center md:justify-start gap-2">
              <Globe className="w-4 h-4" />
              <a 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 hover:underline capitalize truncate max-w-[200px]"
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
