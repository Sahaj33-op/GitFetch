import React, { useState } from 'react';
import { X, Copy, Download, Check } from 'lucide-react';
import { MarkdownExportOptions } from '../lib/markdownExport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopy: (options: MarkdownExportOptions) => void;
  onDownload: (options: MarkdownExportOptions) => void;
  copied: boolean;
}

export function ExportModal({ isOpen, onClose, onCopy, onDownload, copied }: ExportModalProps) {
  const [options, setOptions] = useState<MarkdownExportOptions>({
    includeReadme: true,
    includeStats: true,
    includeOrgs: true,
    includeRepos: true,
    excludeForks: true,
    includeLanguages: true,
    includeActivity: true,
    includePrivateRepos: false,
  });

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({
      ...prev,
      [e.target.name]: e.target.checked
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 dark:bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <div className="glass-panel bg-white/95 dark:bg-zinc-900/90 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Export Markdown</h2>
          <button aria-label="Close modal" onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Customize what is included in your markdown export.</p>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-zinc-200/80 dark:border-zinc-800/60 rounded-xl cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
              <input type="checkbox" name="includeReadme" checked={options.includeReadme} onChange={handleChange} className="w-4 h-4 text-blue-600 dark:text-blue-500 rounded border-zinc-350 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-blue-500 cursor-pointer" />
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Include Profile README</span>
            </label>
            
            <label className="flex items-center gap-3 p-3 border border-zinc-200/80 dark:border-zinc-800/60 rounded-xl cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
              <input type="checkbox" name="includeStats" checked={options.includeStats} onChange={handleChange} className="w-4 h-4 text-blue-600 dark:text-blue-500 rounded border-zinc-350 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-blue-500 cursor-pointer" />
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Include Base Stats (Followers, Stars)</span>
            </label>
            
            <label className="flex items-center gap-3 p-3 border border-zinc-200/80 dark:border-zinc-800/60 rounded-xl cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
              <input type="checkbox" name="includeLanguages" checked={options.includeLanguages} onChange={handleChange} className="w-4 h-4 text-blue-600 dark:text-blue-500 rounded border-zinc-350 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-blue-500 cursor-pointer" />
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Include Primary Languages</span>
            </label>
 
            <label className="flex items-center gap-3 p-3 border border-zinc-200/80 dark:border-zinc-800/60 rounded-xl cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
              <input type="checkbox" name="includeActivity" checked={options.includeActivity} onChange={handleChange} className="w-4 h-4 text-blue-600 dark:text-blue-500 rounded border-zinc-350 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-blue-500 cursor-pointer" />
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Include Recent Activity</span>
            </label>
            
            <label className="flex items-center gap-3 p-3 border border-zinc-200/80 dark:border-zinc-800/60 rounded-xl cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
              <input type="checkbox" name="includeOrgs" checked={options.includeOrgs} onChange={handleChange} className="w-4 h-4 text-blue-600 dark:text-blue-500 rounded border-zinc-350 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-blue-500 cursor-pointer" />
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Include Organizations</span>
            </label>
            
            <label className="flex items-center gap-3 p-3 border border-zinc-200/80 dark:border-zinc-800/60 rounded-xl cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
              <input type="checkbox" name="includeRepos" checked={options.includeRepos} onChange={handleChange} className="w-4 h-4 text-blue-600 dark:text-blue-500 rounded border-zinc-350 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-blue-500 cursor-pointer" />
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Include Public Repositories</span>
            </label>
            
            <label className="flex items-center gap-3 p-3 border border-zinc-200/80 dark:border-zinc-800/60 rounded-xl cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
              <input type="checkbox" name="includePrivateRepos" checked={options.includePrivateRepos} onChange={handleChange} className="w-4 h-4 text-blue-600 dark:text-blue-500 rounded border-zinc-350 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-blue-500 cursor-pointer" />
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Include Private Repositories</span>
            </label>
            
            {options.includeRepos && (
              <label className="flex items-center gap-3 p-3 border border-zinc-200/80 dark:border-zinc-800/60 rounded-xl cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all ml-6 animate-in slide-in-from-left-2 duration-150">
                <input type="checkbox" name="excludeForks" checked={options.excludeForks} onChange={handleChange} className="w-4 h-4 text-blue-600 dark:text-blue-500 rounded border-zinc-350 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-blue-500 cursor-pointer" />
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Exclude Forked Repositories</span>
              </label>
            )}
          </div>
        </div>
        
        <div className="flex gap-3 p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/40">
          <button
            onClick={() => onCopy(options)}
            className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm font-semibold shadow-sm cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-green-600 dark:text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          <button
            onClick={() => {
              onDownload(options);
              onClose();
            }}
            className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-xl hover:bg-zinc-850 dark:hover:bg-white transition-colors text-sm font-semibold shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
