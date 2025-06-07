
// src/components/dashboard/habit-tracker.tsx
"use client";

import type { ChangeEvent } from 'react';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Flame, Dumbbell, BedDouble, Minus, Plus, TrendingUp } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Habit } from '@/types';

const initialHabits: Habit[] = [
  { id: 'fapStreak', name: 'Streak Counter', type: 'streak', value: 0, unit: 'days' },
  { id: 'workout', name: 'Workout Today', type: 'yesNo', value: false },
  { id: 'sleepHours', name: 'Sleep Hours (last night)', type: 'value', value: 0, unit: 'h' },
];

export function HabitTracker() {
  // Initialize useLocalStorage with initialHabits directly.
  // If 'sevenk-habits' exists in localStorage, it will be used.
  // Otherwise, initialHabits will be the starting value.
  const [habits, setHabits] = useLocalStorage<Habit[]>('sevenk-habits', initialHabits);
  
  const [sleepInput, setSleepInput] = useState<string>('');

  useEffect(() => {
    // If habits were loaded from localStorage and 'fapStreak' has the old name,
    // update it to the new default. This is a one-time gentle migration.
    // Users who have already customized it to something else (not "Fap Streak") won't be affected.
    const fapStreakHabit = habits.find(h => h.id === 'fapStreak');
    if (fapStreakHabit && fapStreakHabit.name === 'Fap Streak') {
      setHabits(prevHabits => 
        prevHabits.map(h => 
          h.id === 'fapStreak' ? { ...h, name: 'Streak Counter' } : h
        )
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setHabits]); // Run once on mount effectively to check for old name.

  useEffect(() => {
    const sleepHabit = habits.find(h => h.id === 'sleepHours');
    if (sleepHabit && typeof sleepHabit.value === 'number') {
      setSleepInput(sleepHabit.value.toString());
    }
  }, [habits]);


  const updateHabitValue = (id: string, newValue: number | boolean) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, value: newValue } : h));
  };

  // Function to update a habit's name
  const updateHabitName = (id: string, newName: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, name: newName } : h));
  };

  const handleStreakChange = (id: string, increment: boolean) => {
    const habit = habits.find(h => h.id === id);
    if (habit && habit.type === 'streak' && typeof habit.value === 'number') {
      updateHabitValue(id, Math.max(0, habit.value + (increment ? 1 : -1)));
    }
  };

  const handleToggleChange = (id: string, checked: boolean) => {
    const habit = habits.find(h => h.id === id);
    if (habit && habit.type === 'yesNo') {
      updateHabitValue(id, checked);
    }
  };
  
  const handleSleepInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSleepInput(e.target.value);
  };

  const handleSetSleep = () => {
    const sleepHabit = habits.find(h => h.id === 'sleepHours');
    if (sleepHabit && sleepHabit.type === 'value') {
      const hours = parseFloat(sleepInput);
      if (!isNaN(hours) && hours >= 0 && hours <= 24) {
        updateHabitValue('sleepHours', hours);
      } else {
        if (typeof sleepHabit.value === 'number') {
          setSleepInput(sleepHabit.value.toString());
        }
      }
    }
  };

  const getHabitIcon = (id: string) => {
    if (id === 'fapStreak') return <Flame className="w-6 h-6 text-primary" />;
    if (id === 'workout') return <Dumbbell className="w-6 h-6 text-primary" />;
    if (id === 'sleepHours') return <BedDouble className="w-6 h-6 text-primary" />;
    return <TrendingUp className="w-6 h-6 text-primary" />;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-primary">
          <TrendingUp className="w-6 h-6" />
          Habit Tracker
        </CardTitle>
        <CardDescription>Monitor your key habits for self-improvement.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {habits.map((habit) => (
          <div key={habit.id} className="flex items-center justify-between p-3 bg-card-foreground/5 rounded-lg">
            <div className="flex items-center gap-3 flex-grow min-w-0"> {/* Added min-w-0 for flex child */}
              {getHabitIcon(habit.id)}
              {habit.id === 'fapStreak' ? (
                <Input
                  id={`${habit.id}-name-input`}
                  value={habit.name}
                  onChange={(e) => updateHabitName(habit.id, e.target.value)}
                  className="font-medium h-9 px-3 text-sm w-full max-w-[220px]" // Adjusted width
                  aria-label="Custom streak counter name"
                />
              ) : (
                <Label htmlFor={`${habit.id}-control`} className="font-medium">{habit.name}</Label>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0"> {/* Added flex-shrink-0 */}
              {habit.type === 'streak' && typeof habit.value === 'number' && (
                <>
                  <Button variant="outline" size="icon" onClick={() => handleStreakChange(habit.id, false)} aria-label={`Decrease ${habit.name}`}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span id={`${habit.id}-control`} className="text-lg font-semibold w-8 text-center">{habit.value}</span>
                  <Button variant="outline" size="icon" onClick={() => handleStreakChange(habit.id, true)} aria-label={`Increase ${habit.name}`}>
                    <Plus className="w-4 h-4" />
                  </Button>
                  {habit.unit && <span className="text-sm text-muted-foreground">{habit.unit}</span>}
                </>
              )}

              {habit.type === 'yesNo' && typeof habit.value === 'boolean' && (
                <Switch
                  id={`${habit.id}-control`}
                  checked={habit.value}
                  onCheckedChange={(checked) => handleToggleChange(habit.id, checked)}
                  aria-label={`Toggle ${habit.name}`}
                />
              )}

              {habit.id === 'sleepHours' && habit.type === 'value' && typeof habit.value === 'number' && (
                 <div className="flex items-center gap-2"> {/* Ensured this is also a flex container */}
                  <Input
                    id={`${habit.id}-control`}
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={sleepInput}
                    onChange={handleSleepInputChange}
                    onBlur={handleSetSleep} 
                    className="w-20"
                    aria-label={`Enter ${habit.name}`}
                  />
                  <Button onClick={handleSetSleep} variant="outline" size="sm">Set</Button>
                   <span className="text-sm text-muted-foreground">{habit.value}{habit.unit}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
