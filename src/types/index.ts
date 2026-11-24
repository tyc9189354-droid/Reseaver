export type LogCategory = 'progress' | 'blocker' | 'discussion' | 'idea';

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

// --- LabLog (實驗日誌與避坑) ---
export type LabLogType = 'run' | 'gotcha';

export interface LabLogEntry {
  id: string;
  type: LabLogType;
  title: string;
  createdAt: string;
  tags: string[];
  // 針對 Run 快照
  parameters?: {
    model?: string;
    batchSize?: number;
    learningRate?: string;
    optimizer?: string;
    epochs?: number;
    metrics?: string; // e.g. "Acc: 89.4%, Loss: 0.14"
  };
  notes?: string;
  // 針對 Gotcha 踩坑
  symptom?: string;    // 報錯症狀
  rootCause?: string;  // 踩坑根本原因
  solution?: string;   // 一行秒殺解法
}
