export type ThemeMode = 'light' | 'dark' | 'system';

export type EngineId = 'google' | 'duckduckgo' | 'bing' | 'baidu';

export interface SearchEngine {
  id: EngineId;
  name: string;
  baseUrl: string;
  isEnabled: boolean; // Is it available in the list?
}

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: number;
  engineIds: EngineId[];
}

export interface AppSettings {
  theme: ThemeMode;
  openNewTab: boolean;
}