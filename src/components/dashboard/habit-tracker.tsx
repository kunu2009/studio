"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Minus, TrendingUp } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Habit, HabitType } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function HabitTracker() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('sevenk-habits-v2', []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitType, setNewHabitType] = useState<HabitType>('yesNo');
  const [newHabitGoal, setNewHabitGoal] = useState('10');
  const [newHabitUnit, setNewHabitUnit] = useState('');
  const { toast } = useToast();

  const handleAddHabit = () => {
    if (!newHabitName.trim()) {
      toast({ title: 'Habit name is required.', variant: 'destructive' });
      return;
    }

    const goal = newHabitType === 'yesNo' ? 1 : parseInt(newHabitGoal, 10);
    if (newHabitType === 'counter' && (isNaN(goal) || goal <= 0)) {
        toast({ title: 'Counter goal must be a positive number.', variant: 'destructive' });
        return;
    }

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: newHabitName.trim(),
      type: newHabitType,
      value: 0,
      goal: goal,
      unit: newHabitType === 'counter' ? newHabitUnit.trim() : undefined,
    };

    setHabits(prev => [...prev, newHabit]);
    toast({ title: `Habit "${newHabit.name}" added.` });

    setNewHabitName('');
    setNewHabitType('yesNo');
    setNewHabitGoal('10');
    setNewHabitUnit('');
    setIsDialogOpen(false);
  };

  const handleRemoveHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const updateHabitValue = (id: string, newValue: number) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === id) {
          const clampedValue = Math.max(0, Math.min(newValue, h.goal));
          return { ...h, value: clampedValue };
        }
        return h;
      })
    );
  };

  const renderHabitControls = (habit: Habit) => {
    if (habit.type === 'yesNo') {
      const isCompleted = habit.value >= 1;
      return (
        <div className="flex items-center gap-2">
            <Checkbox
                id={`habit-${habit.id}`}
                checked={isCompleted}
                onCheckedChange={(checked) => updateHabitValue(habit.id, checked ? 1 : 0)}
            />
            <Label htmlFor={`habit-${habit.id}`} className={isCompleted ? 'text-primary' : ''}>
                {isCompleted ? 'Done!' : 'Mark as Done'}
            </Label>
        </div>
      );
    }
    if (habit.type === 'counter') {
      return (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => updateHabitValue(habit.id, habit.value - 1)} aria-label="Decrease count">
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-lg font-semibold w-20 text-center">
            {habit.value} / {habit.goal}
          </span>
          <Button variant="outline" size="icon" onClick={() => updateHabitValue(habit.id, habit.value + 1)} aria-label="Increase count">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex-grow">
          <CardTitle className="flex items-center gap-2 text-xl text-primary">
            <TrendingUp className="w-6 h-6" />
            Habit Tracker
          </CardTitle>
          <CardDescription>Build routines, track progress. Create new habits to get started.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create a New Habit</DialogTitle>
              <DialogDescription>Define what you want to track daily.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="habit-name">Habit Name</Label>
                <Input id="habit-name" placeholder="e.g., Read for 15 minutes" value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tracking Type</Label>
                <RadioGroup defaultValue="yesNo" value={newHabitType} onValueChange={(val: HabitType) => setNewHabitType(val as HabitType)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yesNo" id="type-yesNo" />
                    <Label htmlFor="type-yesNo">Daily Check-off (Yes/No)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="counter" id="type-counter" />
                    <Label htmlFor="type-counter">Counter (e.g., glasses of water)</Label>
                  </div>
                </RadioGroup>
              </div>
              {newHabitType === 'counter' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="habit-goal">Goal</Label>
                    <Input id="habit-goal" type="number" min="1" value={newHabitGoal} onChange={(e) => setNewHabitGoal(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="habit-unit">Unit (optional)</Label>
                    <Input id="habit-unit" placeholder="e.g., pages" value={newHabitUnit} onChange={(e) => setNewHabitUnit(e.target.value)} />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddHabit}>Save Habit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4 h-[250px] overflow-y-auto pr-3">
        {habits.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-muted-foreground">No habits yet. Add one to get started!</p>
          </div>
        ) : (
          habits.map(habit => (
            <div key={habit.id} className="p-4 rounded-lg border bg-card-foreground/5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold">{habit.name}</p>
                    {habit.type === 'counter' && habit.unit && (
                        <p className="text-sm text-muted-foreground">Goal: {habit.goal} {habit.unit}</p>
                    )}
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => handleRemoveHabit(habit.id)} aria-label={`Remove habit: ${habit.name}`}>
                    <Trash2 className="w-4 h-4 text-destructive/80" />
                </Button>
              </div>
              <Progress value={(habit.value / habit.goal) * 100} className="w-full" />
              <div className="flex justify-end items-center">
                {renderHabitControls(habit)}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
