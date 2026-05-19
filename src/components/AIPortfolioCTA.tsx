import React, { useState } from 'react';
import { Bot, Copy, Check } from 'lucide-react';
import { GitHubUser, GitHubRepo, GitHubOrg, GitHubEvent } from '../lib/github';
import { generateAIPortfolioMarkdown } from '../lib/markdownExport';

interface AIPortfolioCTAProps {
  user: GitHubUser;
  repos: GitHubRepo[];
}

export function AIPortfolioCTA({ user, repos }: AIPortfolioCTAProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const markdown = generateAIPortfolioMarkdown(user, repos);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-1">
            <Bot className="w-5 h-5 text-indigo-600" />
            Export for AI Portfolio
          </h3>
          <p className="text-sm text-indigo-700/80 max-w-2xl leading-relaxed">
            Copy a structured Markdown summary you can paste into ChatGPT, Claude, Cursor, v0, Bolt, or Lovable to generate a portfolio website or resume content.
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied to Clipboard' : 'Copy AI Context'}
        </button>
      </div>
    </div>
  );
}
