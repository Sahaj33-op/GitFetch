import React, { useState } from 'react';
import { Bot, Copy, Check, ShieldAlert } from 'lucide-react';
import { GitHubUser, GitHubRepo, GitHubOrg, GitHubSocialAccount, GitHubEvent } from '../lib/github';
import { generateAIPortfolioMarkdown } from '../lib/markdownExport';

interface AIPortfolioCTAProps {
  user: GitHubUser;
  repos: GitHubRepo[];
  readme: string | null;
  orgs: GitHubOrg[];
  socials: GitHubSocialAccount[];
  events: GitHubEvent[];
}

export function AIPortfolioCTA({ user, repos, readme, orgs, socials, events }: AIPortfolioCTAProps) {
  const [copied, setCopied] = useState(false);
  const [includePrivate, setIncludePrivate] = useState(false);
  
  const hasPrivateRepos = repos.some(r => r.private);

  const handleCopy = async () => {
    const markdown = generateAIPortfolioMarkdown(user, repos, readme, orgs, socials, events, includePrivate);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className="glass-panel bg-gradient-to-br from-indigo-500/8 via-blue-500/4 to-transparent rounded-3xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-zinc-100 dark:to-slate-300 bg-clip-text flex items-center gap-2 mb-1.5">
            <Bot className="w-5 h-5 text-indigo-600 dark:text-slate-350" />
            Export for AI Portfolio
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed mb-3.5">
            Copy a structured Markdown summary you can paste into ChatGPT, Claude, Cursor, v0, Bolt, or Lovable to generate a portfolio website or resume content.
          </p>
          <div className="flex items-start gap-2.5 text-xs bg-indigo-500/5 dark:bg-zinc-900/10 border border-indigo-500/20 dark:border-zinc-800/40 p-3.5 rounded-2xl max-w-2xl mb-4 text-indigo-800 dark:text-zinc-350 backdrop-blur-sm">
            <ShieldAlert className="w-4 h-4 shrink-0 text-indigo-600 dark:text-slate-350 mt-0.5" />
            <p className="leading-relaxed">If you used a GitHub token, this export may include private repository metadata. Review before pasting into any AI tool.</p>
          </div>
          
          {hasPrivateRepos && (
            <label className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200 cursor-pointer mt-2 hover:opacity-80 transition-opacity w-max font-semibold">
              <input 
                type="checkbox" 
                checked={includePrivate} 
                onChange={(e) => setIncludePrivate(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-indigo-500"
              />
              <span>Include private repositories in export</span>
            </label>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.97] text-white rounded-xl transition-all text-sm font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied Context' : 'Copy AI Context'}
        </button>
      </div>
    </div>
  );
}
