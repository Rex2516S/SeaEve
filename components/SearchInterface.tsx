import React, { useState } from 'react';
import { Search, Globe, X } from 'lucide-react';
import { Logo } from './Logo';
import { SearchEngine, EngineId } from '../types';

interface SearchInterfaceProps {
  engines: SearchEngine[];
  onSearch: (query: string, engineId: EngineId) => void;
  initialQuery?: string;
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({ 
  engines, 
  onSearch, 
  initialQuery = '' 
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeEngineId, setActiveEngineId] = useState<EngineId | null>(null);

  // Filter only enabled engines
  const enabledEngines = engines.filter(e => e.isEnabled);
  
  // Default to first enabled or google if none
  const currentEngineId = activeEngineId || (enabledEngines.length > 0 ? enabledEngines[0].id : 'google');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, currentEngineId);
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
            placeholder={`Search ${enabledEngines.find(e => e.id === currentEngineId)?.name || '...'} `}
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
          <div className="flex flex-wrap items-center justify-center gap-3">
             {enabledEngines.map((engine) => (
               <button
                key={engine.id}
                type="button"
                onClick={() => setActiveEngineId(engine.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                  ${currentEngineId === engine.id 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-sm scale-105' 
                    : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}
                `}
               >
                  <Globe size={14} />
                  {engine.name}
               </button>
             ))}
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-400 dark:text-zinc-600 font-light">
          SeaEve is a privacy-first frontend. We do not track your data.
        </p>
      </div>
    </div>
  );
};