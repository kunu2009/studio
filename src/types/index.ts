export type HabitType = 'streak' | 'yesNo' | 'value';

export interface Habit {
  id: string; // e.g., 'fapStreak', 'workout', 'sleepHours'
  name: string;
  type: HabitType;
  value: number | boolean; // Current streak count, boolean for yes/no, number for value types like sleep hours
  unit?: string; // Optional: e.g., 'days' for streak, 'hours' for sleep
  // lastUpdated: string; // ISO date string, to track daily updates/resets if needed
}

export interface TodoItem {
  id: string;
  task: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string; // ISO string date
  tags?: string[];
  notes?: string;
  // folderPath?: string; // For future folder structure e.g. "Work/ProjectA"
}

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  text: string;
  mood?: string; // emoji or descriptor like "happy", "sad"
  tags?: string[];
}

export interface AdvancedNote {
  id: string; // For now, 'main-note'. Will be more dynamic with folder structure.
  content: string;
  lastModified: string;
}
