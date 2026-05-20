import React, { useMemo, useState } from 'react';
import { GitHubRepo } from '../lib/github';
import { calculateLanguageStats } from '../lib/githubUtils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon, ChevronDown, ChevronUp } from 'lucide-react';

interface TopLanguagesProps {
  repos: GitHubRepo[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#a855f7'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/80 dark:border-zinc-800 p-3 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{data.name}</p>
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">
          Repositories: <span className="text-blue-600 dark:text-blue-400 font-bold">{data.value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function TopLanguages({ repos }: TopLanguagesProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { chartData, allLanguages } = useMemo(() => {
    const sorted = calculateLanguageStats(repos);

    return {
      chartData: sorted.slice(0, 8),
      allLanguages: sorted
    };
  }, [repos]);

  if (allLanguages.length === 0) return null;

  return (
    <div className="glass-panel p-6 rounded-3xl h-full flex flex-col">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
          Primary Languages
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal ml-1 mt-1">(by Repo Count)</span>
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 border border-indigo-200/50 dark:border-zinc-800/80 rounded-xl bg-white/70 dark:bg-zinc-900/30 text-zinc-505 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:focus-visible:ring-zinc-650"
          title={isExpanded ? "Collapse Section" : "Expand Section"}
          aria-label={isExpanded ? "Collapse Primary Languages" : "Expand Primary Languages"}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      
      <div className={`transition-all duration-300 ease-in-out origin-top overflow-hidden ${
        isExpanded ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0 pointer-events-none -mb-6"
      }`}>
        <div className="flex flex-col xl:flex-row gap-8 items-center flex-1 pt-2">
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
                <Tooltip content={<CustomTooltip />} />
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
                  <span className="text-zinc-700 dark:text-zinc-300 font-semibold whitespace-nowrap">{lang.name}</span>
                  <span className="text-zinc-400 dark:text-zinc-500 text-xs font-semibold ml-1">{lang.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
