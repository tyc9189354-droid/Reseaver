export type LogCategory = 'progress' | 'blocker' | 'discussion' | 'idea' | 'admin';

export interface LogEntry {
  id: string;
  category: LogCategory;
  content: string;
  tags: string[];
  createdAt: string; // ISO 8601
  isArchived?: boolean;
}

export interface WeeklyReportSections {
  whatWasDone: string[];
  blockers: string[];
  discussionPoints: string[];
  nextSteps: string[];
  adminTasks?: string[]; // 實驗室行政與專案進度 (NEW)
}

export interface WeeklyReport {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  meetingDate?: string;
  sections: WeeklyReportSections;
  rawMarkdown: string;
  status: 'draft' | 'finalized';
  includeAdmin?: boolean;
}

// --- 會議指派 Action Item 雙軌結構 ---
export type ActionItemType = 'research' | 'admin';

export interface MeetingActionItem {
  id: string;
  text: string;
  type: ActionItemType; // 'research' 論文研究 vs 'admin' 實驗室行政
  priority?: 'high' | 'normal';
  completed: boolean;
  assignedDate?: string;
}

// --- Meeting 設定 (多組 Meeting 管理) ---
export interface MeetingItem {
  id: string;
  title: string;          // 例如：指導教授個別咪挺、實驗室大咪、CVPR 投稿截稿
  targetTime: string;     // ISO 8601 或 'YYYY-MM-DDTHH:mm'
  repeatWeekly: boolean;  // 是否每週自動循環
  updatedAt?: string;     // 最後更新時間戳記 (ISO 8601)
  description?: string;
  color?: string;         // 標籤顏色
}

// --- PaperCapsule (論文膠囊) ---
export interface PaperCapsule {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue?: string; // e.g. NeurIPS, CVPR, ICLR
  tags: string[]; // e.g. ['#LLM', '#Attention', '#Baseline']
  targetProblem: string; // 核心解決的問題
  coreMethod: string;    // 核心技術 / 創新架構
  keyFinding: string;    // 關鍵指標 / 驗證成果
  limitation: string;    // 局限性 / 未來改進方向
  createdAt: string;
  reviewSchedule: {
    nextReviewDate: string;
    intervalDays: number;
    repetitionCount: number;
    easeFactor: number; // 預設 2.5 (SM-2 算法)
  };
}

// --- LabLog (實驗日誌、避坑與行政 SOP) ---
export type LabLogType = 'run' | 'gotcha' | 'sop';

export interface LabLogEntry {
  id: string;
  type: LabLogType;
  title: string;
  createdAt: string;
  tags: string[];
  parameters?: {
    model?: string;
    batchSize?: number;
    learningRate?: string;
    optimizer?: string;
    epochs?: number;
    metrics?: string;
  };
  notes?: string;
  symptom?: string;
  rootCause?: string;
  solution?: string;
  // 行政 SOP 模式擴充欄位 (NEW)
  sopSteps?: string[];
  sopNotes?: string;
}
