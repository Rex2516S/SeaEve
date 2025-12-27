import React from 'react';
import { HistoryItem, ThemeMode, SearchEngine } from '../types';
import { 
  History, 
  Trash2, 
  Settings, 
  Moon, 
  Sun, 
  Monitor, 
  X,
  Search,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
  onHistoryClick: (query: string, engineId: string) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  engines: SearchEngine[];
  toggleEngine: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onDeleteHistoryItem,
  onHistoryClick,
  theme,
  setTheme,
  engines,
  toggleEngine
}) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside 
        className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl md:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800">
          <Logo size="sm" />
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Engines Settings */}
          <section>
             <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
              <Settings size={12} />
              Active Engines
            </h3>
            <div className="space-y-1">
              {engines.map((engine) => (
                <button
                  key={engine.id}
                  onClick={() => toggleEngine(engine.id)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group"
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <span className="capitalize">{engine.name}</span>
                  </span>
                  {engine.isEnabled ? (
                    <CheckCircle2 size={18} className="text-blue-500" />
                  ) : (
                    <Circle size={18} className="text-gray-300 dark:text-zinc-600" />
                  )}
                </button>
              ))}
            </div>
          </section>

          <hr className="border-gray-100 dark:border-zinc-800" />

          {/* History Section */}
          <section>
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <History size={12} />
                Recent History
              </h3>
              {history.length > 0 && (
                <button 
                  onClick={onClearHistory}
                  className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>
            
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-zinc-600 text-sm">
                No history yet. <br /> Start searching!
              </div>
            ) : (
              <div className="space-y-1">
                {history.map((item) => (
                  <div 
                    key={item.id}
                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <button 
                      className="flex-1 text-left flex items-center gap-3 overflow-hidden"
                      onClick={() => onHistoryClick(item.query, item.engineId)}
                    >
                      <Search size={14} className="text-gray-400 min-w-[14px]" />
                      <div className="flex flex-col truncate">
                         <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{item.query}</span>
                         <span className="text-[10px] text-gray-400 capitalize">{item.engineId} &bull; {new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHistoryItem(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer / Theme Toggle */}
        <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
          <div className="grid grid-cols-3 gap-2 bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
            {[
              { id: 'light', icon: Sun, label: 'Light' },
              { id: 'dark', icon: Moon, label: 'Dark' },
              { id: 'system', icon: Monitor, label: 'Auto' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as ThemeMode)}
                className={`flex flex-col items-center justify-center py-2 rounded-lg text-[10px] font-medium transition-all ${
                  theme === t.id 
                    ? 'bg-white dark:bg-zinc-600 shadow-sm text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <t.icon size={16} className="mb-1" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};