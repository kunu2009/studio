import type { Flashcard } from '@/types';
import { addDays } from 'date-fns';

const MIN_EASE_FACTOR = 1.3;

/**
 * Implements a simplified SM-2 like algorithm for spaced repetition.
 * @param card The flashcard to update.
 * @param quality A number from 0-2 representing recall quality (0: Again, 1: Good, 2: Easy).
 * @returns The updated flashcard with new SRS data.
 */
export function calculateNextReview(card: Flashcard, quality: 0 | 1 | 2): Flashcard {
  const now = new Date();
  
  if (quality < 1) { // "Again" - incorrect response
    return {
      ...card,
      repetition: 0, // Reset repetition count
      nextReview: addDays(now, 1).toISOString(), // Review again tomorrow
      lastReviewed: now.toISOString(),
    };
  }

  // Correct response
  const newRepetition = card.repetition + 1;
  
  // Update ease factor
  const easeFactorDelta = 0.1 - (2 - quality) * (0.08 + (2 - quality) * 0.02);
  let newEaseFactor = card.easeFactor + easeFactorDelta;
  if (newEaseFactor < MIN_EASE_FACTOR) {
    newEaseFactor = MIN_EASE_FACTOR;
  }

  // Calculate next interval in days
  let intervalInDays: number;
  if (newRepetition === 1) {
    intervalInDays = 1;
  } else if (newRepetition === 2) {
    intervalInDays = 4;
  } else {
    intervalInDays = Math.round(card.repetition * newEaseFactor * 2.5);
  }

  return {
    ...card,
    repetition: newRepetition,
    easeFactor: newEaseFactor,
    nextReview: addDays(now, intervalInDays).toISOString(),
    lastReviewed: now.toISOString(),
  };
}
