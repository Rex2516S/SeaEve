import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Menu, ExternalLink, RotateCw, AlertCircle, GripHorizontal, Maximize2 } from 'lucide-react';
import { Logo } from './Logo';
import { SearchEngine, EngineId } from '../types';

interface SearchResultViewProps {
  engines: SearchEngine[];
  query: string;
  engineIds: EngineId[];
  onSearch: (query: string, engineIds: EngineId[]) => void;
  onMenuClick: () => void;
  onHomeClick: () => void;
}

export const SearchResultView: React.FC<SearchResultViewProps> = ({
  engines,
  query,
  engineIds,
  onSearch,
  onMenuClick,
  onHomeClick
}) => {
  const [localQuery, setLocalQuery] = useState(query);
  // Order of engines for display
  const [orderedEngineIds, setOrderedEngineIds] = useState<EngineId[]>(engineIds);
  const [iframeKeys, setIframeKeys] = useState<Record<string, number>>({});
  
  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    // When prop changes (e.g. from history), update local order, preserving existing if possible or resetting
    setOrderedEngineIds(engineIds);
  }, [engineIds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onSearch(localQuery, orderedEngineIds);
    }
  };

  const reloadFrame = (id: string) => {
    setIframeKeys(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeEngine = (id: EngineId) => {
    const newOrder = orderedEngineIds.filter(e => e !== id);
    if (newOrder.length === 0) {
      onHomeClick();
    } else {
      setOrderedEngineIds(newOrder);
    }
  };

  // Drag Handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newOrder = [...orderedEngineIds];
    const draggedItem = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedItem);

    setOrderedEngineIds(newOrder);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Determine grid columns based on count
  const count = orderedEngineIds.length;
  let gridClass = 'grid-cols-1';
  if (count === 2) gridClass = 'md:grid-cols-2';
  if (count >= 3) gridClass = 'md:grid-cols-2 lg:grid-cols-2'; // 2x2 typically looks better than 3 columns for web pages

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-zinc-950 overflow-hidden">
      {/* Top Bar */}
      <div className="flex-none flex items-center gap-2 p-2 px-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm z-30">
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
        </form>
      </div>

      {/* Main Content Grid */}
      <div className={`flex-1 overflow-hidden grid ${gridClass} gap-1 p-1 bg-gray-200 dark:bg-zinc-900`}>
        {orderedEngineIds.map((engId, index) => {
          const engine = engines.find(e => e.id === engId);
          if (!engine) return null;
          
          const url = `${engine.baseUrl}${encodeURIComponent(localQuery)}`;
          const key = iframeKeys[engId] || 0;

          return (
            <div 
              key={`${engId}-${key}`}
              className={`
                relative flex flex-col bg-white dark:bg-zinc-950 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-zinc-800
                ${draggedIndex === index ? 'opacity-50 ring-2 ring-blue-500' : ''}
              `}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 cursor-move select-none text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <GripHorizontal size={14} className="text-gray-300" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{engine.name}</span>
                </div>
                <div className="flex items-center gap-1">
                   <button 
                      onClick={() => reloadFrame(engId)} 
                      title="Reload"
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded text-gray-500"
                  >
                      <RotateCw size={14} />
                   </button>
                   <a 
                      href={url} 
                      target="_blank" 
                      rel="noreferrer"
                      title="Open New Tab"
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded text-gray-500"
                  >
                      <ExternalLink size={14} />
                   </a>
                   <button 
                      onClick={() => removeEngine(engId)} 
                      title="Close Panel"
                      className="p-1.5 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 rounded text-gray-400 transition-colors"
                  >
                      <X size={14} />
                   </button>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="flex-1 relative w-full h-full bg-white dark:bg-zinc-950">
                <div className="absolute inset-0 flex flex-col items-center justify-center z-0 text-gray-400 p-8 text-center select-none pointer-events-none">
                     <AlertCircle size={32} className="mb-2 opacity-30"/>
                     <p className="text-xs max-w-[200px]">
                        Waiting for {engine.name}... <br/>
                        If blocked, open externally.
                     </p>
                </div>
                <iframe 
                    src={url} 
                    className="absolute inset-0 w-full h-full border-0 z-10 bg-white"
                    title={`${engine.name} Results`}
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};