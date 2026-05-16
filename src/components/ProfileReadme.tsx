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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          Profile README
        </h2>
        
        <div className="flex bg-gray-50/80 p-1 rounded-xl border border-gray-100">
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'preview' 
                ? 'bg-white text-gray-900 shadow-sm border border-gray-100' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'code' 
                ? 'bg-white text-gray-900 shadow-sm border border-gray-100' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
          >
            <Code className="w-4 h-4" />
            Code
          </button>
        </div>
      </div>

      {viewMode === 'preview' ? (
        <div className="markdown-body !bg-transparent" style={{ backgroundColor: 'transparent' }}>
          <Markdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
            components={{
              // Ensure images don't break the layout and handle referrer policy
              img: ({ node, ...props }) => (
                <img 
                  {...props} 
                  style={{ maxWidth: '100%', borderRadius: '8px' }} 
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
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-x-auto">
          <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap break-all">
            {content}
          </pre>
        </div>
      )}
    </div>
  );
}
