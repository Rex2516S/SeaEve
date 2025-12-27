import React, { useState, useEffect } from 'react';
import { Search, X, Menu, ExternalLink, RotateCw, AlertCircle } from 'lucide-react';
import { Logo } from './Logo';
import { SearchEngine, EngineId } from '../types';

interface SearchResultViewProps {
  engines: SearchEngine[];
  query: string;
  engineId: EngineId;
  onSearch: (query: string, engineId: EngineId) => void;
  onMenuClick: () => void;
  onHomeClick: () => void;
}

export const SearchResultView: React.FC<SearchResultViewProps> = ({
  engines,
  query,
  engineId,
  onSearch,
  onMenuClick,
  onHomeClick
}) => {
  const [localQuery, setLocalQuery] = useState(query);
  const [localEngineId, setLocalEngineId] = useState(engineId);
  const [iframeKey, setIframeKey] = useState(0); // To force reload

  const activeEngine = engines.find(e => e.id === localEngineId) || engines.find(e => e.isEnabled) || engines[0];

  useEffect(() => {
    setLocalQuery(query);
    setLocalEngineId(engineId);
  }, [query, engineId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onSearch(localQuery, localEngineId);
    }
  };

  const currentUrl = activeEngine ? `${activeEngine.baseUrl}${encodeURIComponent(localQuery)}` : '';

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Top Bar */}
      <div className="flex items-center gap-2 p-2 px-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm z-20">
        <button onClick={onMenuClick} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <Menu size={20} className="text-gray-600 dark:text-gray-300"/>
        </button>
        
        <div onClick={onHomeClick} className="cursor-pointer hidden md:flex items-center mr-4">
             <Logo size="sm" className="!text-2xl" />
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 flex items-center max-w-3xl gap-2">
            <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400"/>
                </div>
                <input 
                    className="w-full bg-gray-100 dark:bg-zinc-800 border-transparent focus:bg-white dark:focus:bg-black focus:border-blue-500 rounded-full py-2 pl-10 pr-10 text-sm transition-all outline-none text-gray-800 dark:text-gray-100 border shadow-sm"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                />
                 {localQuery && (
                    <button
                    type="button"
                    onClick={() => setLocalQuery('')}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                    <X size={14} />
                    </button>
                )}
            </div>
            
            {/* Engine Selector - Mini */}
             <select 
                value={localEngineId}
                onChange={(e) => {
                    const newId = e.target.value as EngineId;
                    setLocalEngineId(newId);
                    if (localQuery.trim()) {
                      onSearch(localQuery, newId);
                    }
                }}
                className="bg-transparent text-sm font-medium text-gray-600 dark:text-gray-300 border-none outline-none cursor-pointer hover:text-blue-500 max-w-[100px] truncate"
            >
                {engines.filter(e => e.isEnabled).map(e => (
                    <option key={e.id} value={e.id} className="dark:bg-zinc-900">{e.name}</option>
                ))}
            </select>
        </form>

        <div className="flex items-center gap-1 ml-2">
             <button 
                onClick={() => setIframeKey(k => k + 1)} 
                title="Reload Frame"
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-gray-500 transition-colors"
            >
                <RotateCw size={18} />
             </button>
             <a 
                href={currentUrl} 
                target="_blank" 
                rel="noreferrer"
                title="Open in new tab"
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-gray-500 transition-colors"
            >
                <ExternalLink size={18} />
             </a>
        </div>
      </div>

      {/* Main Content / Iframe */}
      <div className="flex-1 relative w-full overflow-hidden bg-white dark:bg-zinc-950">
        <div className="absolute inset-0 flex flex-col items-center justify-center z-0 text-gray-400 p-8 text-center select-none">
             <AlertCircle size={48} className="mb-4 opacity-50"/>
             <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Content Placeholder</p>
             <p className="text-sm mt-2 max-w-md text-gray-400 dark:text-gray-500">
                Attempting to load {activeEngine?.name}...
                <br/><br/>
                <span className="text-xs">
                Note: Most modern search engines (Google, Bing, etc.) strictly block embedding in other websites for security. 
                If the screen is blank or refuses to connect, please use the icon above to open results in a new tab.
                </span>
             </p>
        </div>
        {activeEngine && (
          <iframe 
              key={iframeKey}
              src={currentUrl} 
              className="absolute inset-0 w-full h-full border-0 z-10 bg-white"
              title="Search Results"
              // Sandbox is important but might be too restrictive for some engines. 
              // 'allow-same-origin' needed for some interactions, but might be blocked by X-Frame-Options SAMEORIGIN if domains don't match.
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation"
          />
        )}
      </div>
    </div>
  );
};