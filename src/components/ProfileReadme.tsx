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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          Profile README
        </h2>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'preview' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'code' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Code className="w-4 h-4" />
            Code
          </button>
        </div>
      </div>

      {viewMode === 'preview' ? (
        <div className="markdown-body !bg-transparent !p-0">
          <Markdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
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
