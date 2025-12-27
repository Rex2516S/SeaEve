import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { SearchInterface } from './components/SearchInterface';
import { SearchResultView } from './components/SearchResultView';
import { useTheme } from './hooks/useTheme';
import useLocalStorage from './hooks/useLocalStorage';
import { SearchEngine, HistoryItem, EngineId } from './types';

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 9);

const DEFAULT_ENGINES: SearchEngine[] = [
  { id: 'google', name: 'Google', baseUrl: 'https://www.google.com/search?igu=1&q=', isEnabled: true }, 
  { id: 'duckduckgo', name: 'DuckDuckGo', baseUrl: 'https://duckduckgo.com/?q=', isEnabled: true },
  { id: 'bing', name: 'Bing', baseUrl: 'https://www.bing.com/search?q=', isEnabled: true },
  { id: 'baidu', name: 'Baidu', baseUrl: 'https://www.baidu.com/s?wd=', isEnabled: true },
];

type ViewMode = 'home' | 'results';

const App: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('sea-eve-history', []);
  const [engines, setEngines] = useLocalStorage<SearchEngine[]>('sea-eve-engines', DEFAULT_ENGINES);
  
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentEngineIds, setCurrentEngineIds] = useState<EngineId[]>([]);

  // Initialize missing engines
  useEffect(() => {
    if (engines.length < DEFAULT_ENGINES.length) {
      const merged = DEFAULT_ENGINES.map(def => {
        const existing = engines.find(e => e.id === def.id);
        return existing || def;
      });
      setEngines(merged);
    }
  }, []);

  const handleSearch = (query: string, engineIds: EngineId[]) => {
    // Add to history
    const newHistoryItem: HistoryItem = {
      id: generateId(),
      query,
      timestamp: Date.now(),
      engineIds
    };
    
    setHistory([newHistoryItem, ...history].slice(0, 50));

    // Update state to show results
    setCurrentQuery(query);
    setCurrentEngineIds(engineIds);
    setViewMode('results');
  };

  const handleHistoryClick = (query: string, engineIds: EngineId[]) => {
      // Ensure requested engines are enabled or valid, fallback to enabled ones if needed
      const validIds = engineIds.filter(id => engines.some(e => e.id === id && e.isEnabled));
      
      const targetIds = validIds.length > 0 
        ? validIds 
        : [engines.find(e => e.isEnabled)?.id || 'google'] as EngineId[];
      
      handleSearch(query, targetIds);
      // Close sidebar on mobile if open
      setIsSidebarOpen(false);
  };

  const clearHistory = () => setHistory([]);
  
  const deleteHistoryItem = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const toggleEngine = (id: string) => {
    setEngines(engines.map(eng => 
      eng.id === id ? { ...eng, isEnabled: !eng.isEnabled } : eng
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30">
      
      {/* Sidebar is global */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        history={history}
        onClearHistory={clearHistory}
        onDeleteHistoryItem={deleteHistoryItem}
        onHistoryClick={handleHistoryClick}
        theme={theme}
        setTheme={setTheme}
        engines={engines}
        toggleEngine={toggleEngine}
      />

      {/* View Switcher */}
      {viewMode === 'home' ? (
        <>
          {/* Header only for Home view */}
          <header className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-30 pointer-events-none">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="pointer-events-auto p-3 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors text-gray-600 dark:text-gray-300 shadow-sm bg-white/80 dark:bg-black/20 backdrop-blur-md"
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center min-h-screen pb-20 w-full">
            <SearchInterface 
              engines={engines} 
              onSearch={handleSearch} 
              initialQuery={currentQuery} 
            />
          </main>
        </>
      ) : (
        <SearchResultView 
          engines={engines}
          query={currentQuery}
          engineIds={currentEngineIds}
          onSearch={handleSearch}
          onMenuClick={() => setIsSidebarOpen(true)}
          onHomeClick={() => {
              setViewMode('home');
              setCurrentQuery(''); 
          }}
        />
      )}

    </div>
  );
};

export default App;