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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Export Markdown</h2>
          <button aria-label="Close modal" onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 mb-4">Customize what is included in your markdown export.</p>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" name="includeReadme" checked={options.includeReadme} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-800">Include Profile README</span>
            </label>
            
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" name="includeStats" checked={options.includeStats} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-800">Include Base Stats (Followers, Stars)</span>
            </label>
            
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" name="includeLanguages" checked={options.includeLanguages} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-800">Include Top Languages</span>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" name="includeActivity" checked={options.includeActivity} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-800">Include Recent Activity</span>
            </label>
            
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" name="includeOrgs" checked={options.includeOrgs} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-800">Include Organizations</span>
            </label>
            
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" name="includeRepos" checked={options.includeRepos} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-800">Include Public Repositories</span>
            </label>
            
            {options.includeRepos && (
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ml-6">
                <input type="checkbox" name="excludeForks" checked={options.excludeForks} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm font-medium text-gray-800">Exclude Forked Repositories</span>
              </label>
            )}
          </div>
        </div>
        
        <div className="flex gap-3 p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => onCopy(options)}
            className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          <button
            onClick={() => {
              onDownload(options);
              onClose();
            }}
            className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
