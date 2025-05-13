"use client";

import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Flame, Dumbbell, BedDouble, Minus, Plus } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { HabitStats } from '@/types';

const initialHabitStats: HabitStats = {
  fapStreak: 0,
  workout: false,
  sleepHours: 0,
};

export function GlowUpDisplay() {
  const [habits, setHabits] = useLocalStorage<HabitStats>('zenith-habits', initialHabitStats);
  const [sleepInput, setSleepInput] = useState<string>(habits.sleepHours.toString());

  const handleStreakChange = (increment: boolean) => {
    setHabits(prev => ({ ...prev, fapStreak: Math.max(0, prev.fapStreak + (increment ? 1 : -1)) }));
  };

  const handleWorkoutToggle = (checked: boolean) => {
    setHabits(prev => ({ ...prev, workout: checked }));
  };

  const handleSleepInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSleepInput(e.target.value);
  };
  
  const handleSetSleep = () => {
    const hours = parseFloat(sleepInput);
    if (!isNaN(hours) && hours >= 0 && hours <= 24) {
      setHabits(prev => ({ ...prev, sleepHours: hours }));
    } else {
      // Optionally, show an error toast or message
      setSleepInput(habits.sleepHours.toString()); // Reset to valid value
    }
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-primary">
          <TrendingUpIcon className="w-6 h-6" />
          Glow-Up Tracker
        </CardTitle>
        <CardDescription>Monitor your key habits for self-improvement.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-3 bg-card-foreground/5 rounded-lg">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-primary" />
            <span className="font-medium">Fap Streak</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => handleStreakChange(false)} aria-label="Decrease fap streak">
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold w-8 text-center">{habits.fapStreak}</span>
            <Button variant="outline" size="icon" onClick={() => handleStreakChange(true)} aria-label="Increase fap streak">
              <Plus className="w-4 h-4" />
            </Button>
             <span className="text-sm text-muted-foreground">days</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-card-foreground/5 rounded-lg">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-6 h-6 text-primary" />
            <Label htmlFor="workout-toggle" className="font-medium">Workout Today</Label>
          </div>
          <Switch
            id="workout-toggle"
            checked={habits.workout}
            onCheckedChange={handleWorkoutToggle}
            aria-label="Toggle workout status"
          />
        </div>

        <div className="p-3 bg-card-foreground/5 rounded-lg space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <BedDouble className="w-6 h-6 text-primary" />
            <Label htmlFor="sleep-hours" className="font-medium">Sleep Hours (last night)</Label>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="sleep-hours"
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={sleepInput}
              onChange={handleSleepInputChange}
              onBlur={handleSetSleep} // Set on blur to avoid rapid updates
              className="w-24"
              aria-label="Enter sleep hours"
            />
            <Button onClick={handleSetSleep} variant="outline">Set</Button>
            <span className="text-lg font-semibold">{habits.sleepHours}h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Placeholder for TrendingUpIcon if not available or for a more thematic icon
function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
