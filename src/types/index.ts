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
