import React, { useMemo } from 'react';
import { GitHubRepo } from '../lib/github';
import { calculateLanguageStats } from '../lib/githubUtils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface TopLanguagesProps {
  repos: GitHubRepo[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export function TopLanguages({ repos }: TopLanguagesProps) {
  const { chartData, allLanguages } = useMemo(() => {
    const sorted = calculateLanguageStats(repos);

    return {
      chartData: sorted.slice(0, 8),
      allLanguages: sorted
    };
  }, [repos]);

  if (allLanguages.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
      
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-1/2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
            {allLanguages.map((lang, index) => (
              <div key={lang.name} className="flex items-center gap-2 text-sm">
                <span 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: index < COLORS.length ? COLORS[index] : '#cbd5e1' }}
                ></span>
                <span className="text-gray-700 font-medium truncate">{lang.name}</span>
                <span className="text-gray-400 text-xs ml-auto">{lang.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
