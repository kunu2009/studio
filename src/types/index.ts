
export interface Project {
  id: string;
  name: string;
  color: string; // e.g., 'bg-red-500'
}

export interface TodoItem {
  id: string;
  task: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string; // ISO string date
  tags?: string[];
  notes?: string;
  pomodorosCompleted?: number;
  projectId?: string;
  isNextAction?: boolean;
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

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: string;
  // For spaced repetition
  lastReviewed?: string; // ISO string
  nextReview: string; // ISO string
  repetition: number; // How many times it has been successfully recalled
  easeFactor: number; // A multiplier for the next interval
}

export interface MicroChallenge {
  text: string;
  completed: boolean;
}

export interface MicroChallengeState {
  date: string; // ISO date string (YYYY-MM-DD)
  challenges: MicroChallenge[];
  streak: number;
  points: number;
}
