import { LogEntry, MeetingItem, PaperCapsule, LabLogEntry } from '../types';

export interface ReseaverSyncPayload {
  version: string;
  timestamp: string;
  logs: LogEntry[];
  meetings: MeetingItem[];
  activeMeetingId?: string | null;
  papers: PaperCapsule[];
  labLogs: LabLogEntry[];
}

export const SyncService = {
  /**
   * 打包本機所有資料為單一傳輸物件
   */
  exportPayload(): ReseaverSyncPayload {
    const getLocal = (key: string) => {
      try {
        return JSON.parse(localStorage.getItem(key) || '[]');
      } catch {
        return [];
      }
    };

    return {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      logs: getLocal('reseaver_labpulse_logs'),
      meetings: getLocal('reseaver_meetings'),
      activeMeetingId: localStorage.getItem('reseaver_active_meeting_id') || null,
      papers: getLocal('reseaver_paper_capsules'),
      labLogs: getLocal('reseaver_lab_logs'),
    };
  },

  /**
   * 智慧雙向合併：依照 ID 去重並比較修改時間覆寫
   */
  importAndMerge(remote: ReseaverSyncPayload): { addedLogs: number; addedPapers: number; addedMeetings: number } {
    const mergeById = <T extends { id: string; updatedAt?: string; createdAt?: string }>(
      local: T[],
      remoteList: T[] = [],
      isMeeting = false
    ): { merged: T[]; added: number } => {
      const map = new Map<string, T>();
      local.forEach((item) => map.set(item.id, item));
      let added = 0;
      remoteList.forEach((item) => {
        if (!map.has(item.id)) {
          map.set(item.id, item);
          added++;
        } else {
          const existing = map.get(item.id)!;
          const remoteTime = new Date(item.updatedAt || item.createdAt || (isMeeting ? remote.timestamp : 0) || 0).getTime();
          const localTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
          if (remoteTime > localTime || (isMeeting && JSON.stringify(item) !== JSON.stringify(existing))) {
            map.set(item.id, { ...existing, ...item });
          }
        }
      });
      return { merged: Array.from(map.values()), added };
    };

    const current = this.exportPayload();

    const mergedLogs = mergeById(current.logs, remote.logs);
    const mergedMeetings = mergeById(current.meetings, remote.meetings, true);
    const mergedPapers = mergeById(current.papers, remote.papers);
    const mergedLabLogs = mergeById(current.labLogs, remote.labLogs);

    // 儲存回 localStorage
    localStorage.setItem('reseaver_labpulse_logs', JSON.stringify(mergedLogs.merged));
    localStorage.setItem('reseaver_meetings', JSON.stringify(mergedMeetings.merged));
    localStorage.setItem('reseaver_paper_capsules', JSON.stringify(mergedPapers.merged));
    localStorage.setItem('reseaver_lab_logs', JSON.stringify(mergedLabLogs.merged));

    if (remote.activeMeetingId) {
      localStorage.setItem('reseaver_active_meeting_id', remote.activeMeetingId);
    }

    return {
      addedLogs: mergedLogs.added,
      addedMeetings: mergedMeetings.added,
      addedPapers: mergedPapers.added,
    };
  },
};
