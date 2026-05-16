import React, { useMemo } from 'react';
import { GitHubRepo } from '../lib/github';
import { calculateLanguageStats } from '../lib/githubUtils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

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
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
        <PieChartIcon className="w-5 h-5 text-gray-400" />
        Languages
      </h3>
      
      <div className="flex flex-col xl:flex-row gap-8 items-center flex-1">
        <div className="w-full xl:w-1/2 h-[200px] xl:h-[250px] shrink-0">
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
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#111827', fontWeight: 500 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full xl:w-1/2">
          <div className="flex flex-wrap gap-y-3 gap-x-5">
            {allLanguages.slice(0, 10).map((lang, index) => (
              <div key={lang.name} className="flex items-center gap-2 text-sm w-[calc(50%-1.25rem)] sm:w-auto">
                <span 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" 
                  style={{ backgroundColor: index < COLORS.length ? COLORS[index] : '#e2e8f0' }}
                ></span>
                <span className="text-gray-700 font-medium whitespace-nowrap">{lang.name}</span>
                <span className="text-gray-400 text-xs font-semibold ml-1">{lang.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
