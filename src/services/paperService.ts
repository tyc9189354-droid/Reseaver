import { PaperCapsule } from '../types';

const STORAGE_KEY = 'reseaver_paper_capsules';

export const PaperService = {
  getStoredPapers(): PaperCapsule[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data) as PaperCapsule[];
    } catch {
      return [];
    }
  },

  savePapers(papers: PaperCapsule[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
  },

  /**
   * 間隔重複演算法 (簡化版 SuperMemo-2)
   * rating: 1 (忘記/困難), 2 (普通), 3 (熟練/容易)
   */
  processReview(paper: PaperCapsule, rating: 1 | 2 | 3): PaperCapsule {
    const schedule = { ...paper.reviewSchedule };

    if (rating === 1) {
      schedule.intervalDays = 1;
      schedule.repetitionCount = 0;
      schedule.easeFactor = Math.max(1.3, schedule.easeFactor - 0.2);
    } else if (rating === 2) {
      schedule.repetitionCount += 1;
      schedule.intervalDays = Math.max(1, Math.round(schedule.intervalDays * 1.5));
    } else {
      schedule.repetitionCount += 1;
      if (schedule.repetitionCount === 1) {
        schedule.intervalDays = 2;
      } else if (schedule.repetitionCount === 2) {
        schedule.intervalDays = 4;
      } else {
        schedule.intervalDays = Math.round(schedule.intervalDays * schedule.easeFactor);
      }
      schedule.easeFactor += 0.1;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + schedule.intervalDays);
    schedule.nextReviewDate = nextDate.toISOString();

    return {
      ...paper,
      reviewSchedule: schedule,
    };
  },
};
