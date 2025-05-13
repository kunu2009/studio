export interface HabitStats {
  fapStreak: number;
  workout: boolean;
  sleepHours: number;
}

export interface TodoItem {
  id: string;
  task: string;
  completed: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
}

export interface AdvancedNote {
  id: string;
  content: string;
  lastModified: string;
}
