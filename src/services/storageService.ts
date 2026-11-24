import { LogEntry } from '../types';

const STORAGE_KEY = 'reseaver_labpulse_logs';

export const StorageService = {
  getLogs(): LogEntry[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data) as LogEntry[];
    } catch {
      return [];
    }
  },

  saveLogs(logs: LogEntry[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  },

  addLog(entry: Omit<LogEntry, 'id' | 'createdAt'>): LogEntry {
    const logs = this.getLogs();
    const newLog: LogEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    logs.unshift(newLog);
    this.saveLogs(logs);
    return newLog;
  },

  deleteLog(id: string): void {
    const logs = this.getLogs().filter((l) => l.id !== id);
    this.saveLogs(logs);
  },
};
