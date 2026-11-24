import { LabLogEntry } from '../types';

const STORAGE_KEY = 'reseaver_lab_logs';

export const LabLogService = {
  getLogs(): LabLogEntry[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data) as LabLogEntry[];
    } catch {
      return [];
    }
  },

  saveLogs(logs: LabLogEntry[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  },

  addEntry(entry: Omit<LabLogEntry, 'id' | 'createdAt'>): LabLogEntry {
    const logs = this.getLogs();
    const newEntry: LabLogEntry = {
      ...entry,
      id: `lab-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    logs.unshift(newEntry);
    this.saveLogs(logs);
    return newEntry;
  },

  deleteEntry(id: string): void {
    const logs = this.getLogs().filter((l) => l.id !== id);
    this.saveLogs(logs);
  },
};
