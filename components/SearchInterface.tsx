import React, { useState } from 'react';
import { Search, Globe, X, Check } from 'lucide-react';
import { Logo } from './Logo';
import { SearchEngine, EngineId } from '../types';

interface SearchInterfaceProps {
  engines: SearchEngine[];
  onSearch: (query: string, engineIds: EngineId[]) => void;
  initialQuery?: string;
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({ 
  engines, 
  onSearch, 
  initialQuery = '' 
}) => {
  const [query, setQuery] = useState(initialQuery);
  // Default to the first enabled engine if available
  const [activeEngineIds, setActiveEngineIds] = useState<EngineId[]>(() => {
    const first = engines.find(e => e.isEnabled);
    return first ? [first.id] : [];
  });

  // Filter only enabled engines
  const enabledEngines = engines.filter(e => e.isEnabled);

  const toggleEngine = (id: EngineId) => {
    setActiveEngineIds(prev => {
      if (prev.includes(id)) {
        // Prevent deselecting the last one
        if (prev.length === 1) return prev;
        return prev.filter(e => e !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && activeEngineIds.length > 0) {
      onSearch(query, activeEngineIds);
      setQuery('');
    }
  };

  return (
    <div className="w-full max-w-2xl px-4 flex flex-col items-center animate-in fade-in zoom-in duration-500">
      <div className="mb-8 md:mb-12">
        <Logo size="lg" />
      </div>

      <form onSubmit={handleSubmit} className="w-full relative group z-10">
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-300 -z-10`}></div>
        <div className="relative flex items-center w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="pl-6 text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search on ${activeEngineIds.length} engine${activeEngineIds.length > 1 ? 's' : ''}...`}
            className="w-full py-4 px-4 bg-transparent border-none outline-none text-lg text-gray-800 dark:text-gray-100 placeholder-gray-400"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-2 mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      {/* Engine Selector */}
      <div className="mt-8 w-full">
        {enabledEngines.length === 0 ? (
          <p className="text-center text-sm text-red-500">Please enable at least one search engine in the sidebar.</p>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Select Engines (Multi-select)</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {enabledEngines.map((engine) => {
                const isActive = activeEngineIds.includes(engine.id);
                return (
                  <button
                    key={engine.id}
                    type="button"
                    onClick={() => toggleEngine(engine.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border select-none
                      ${isActive 
                        ? 'bg-blue-500 border-blue-600 text-white shadow-md scale-105' 
                        : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}
                    `}
                  >
                    {isActive ? <Check size={14} /> : <Globe size={14} />}
                    {engine.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-400 dark:text-zinc-600 font-light">
          SeaEve is a privacy-first frontend. Select multiple engines to compare results.
        </p>
      </div>
    </div>
  );
};