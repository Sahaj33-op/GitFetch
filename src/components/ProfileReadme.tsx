import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Eye, Code, ChevronDown, ChevronUp } from 'lucide-react';

interface ProfileReadmeProps {
  content: string;
}

export function ProfileReadme({ content }: ProfileReadmeProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="glass-panel p-6 md:p-8 overflow-hidden rounded-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 w-full">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          Profile README
          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 border border-zinc-200/50 dark:border-zinc-800/40 px-2 py-0.5 rounded-lg flex items-center gap-1 shrink-0">
            ⚡ {Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200))} min read
          </span>
        </h2>
        
        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          {isExpanded && (
            <div className="flex bg-zinc-100/55 dark:bg-zinc-900/50 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800/55 transition-all duration-300">
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
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 border border-indigo-200/50 dark:border-zinc-800/80 rounded-xl bg-white/70 dark:bg-zinc-900/30 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:focus-visible:ring-zinc-650"
            title={isExpanded ? "Collapse Section" : "Expand Section"}
            aria-label={isExpanded ? "Collapse Profile README" : "Expand Profile README"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className={`transition-all duration-300 ease-in-out origin-top ${
        isExpanded ? "opacity-100 max-h-none" : "opacity-0 max-h-0 overflow-hidden pointer-events-none -mb-8"
      }`}>
        <div className="pt-2">
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
      </div>
    </div>
  );
}
