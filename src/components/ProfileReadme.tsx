import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Eye, Code } from 'lucide-react';

interface ProfileReadmeProps {
  content: string;
}

export function ProfileReadme({ content }: ProfileReadmeProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  return (
    <div className="glass-panel p-6 md:p-8 overflow-hidden rounded-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          Profile README
        </h2>
        
        <div className="flex bg-zinc-100/55 dark:bg-zinc-900/50 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800/55">
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              viewMode === 'preview' 
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm border border-zinc-200/80 dark:border-zinc-700/50' 
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-850/30'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              viewMode === 'code' 
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm border border-zinc-200/80 dark:border-zinc-700/50' 
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-850/30'
            }`}
          >
            <Code className="w-4 h-4" />
            Code
          </button>
        </div>
      </div>

      {viewMode === 'preview' ? (
        <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
          <div className="markdown-body !bg-transparent text-zinc-850 dark:text-zinc-200" style={{ backgroundColor: 'transparent' }}>
            <Markdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              components={{
                // Ensure images don't break the layout and handle referrer policy
                img: ({ node, ...props }) => (
                  <img 
                    {...props} 
                    style={{ maxWidth: '100%', borderRadius: '12px' }} 
                    referrerPolicy="no-referrer" 
                  />
                ),
                // Ensure links open in new tab
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                )
              }}
            >
              {content}
            </Markdown>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-50 dark:bg-zinc-950/40 rounded-xl p-4 border border-zinc-200/85 dark:border-zinc-800/80 overflow-x-auto">
          <pre className="text-sm text-zinc-800 dark:text-zinc-200 font-mono whitespace-pre-wrap break-all">
            {content}
          </pre>
        </div>
      )}
    </div>
  );
}
