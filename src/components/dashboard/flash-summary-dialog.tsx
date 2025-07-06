"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, X, Zap, BarChart2, Smile, Trophy, ListTodo } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { JournalEntry, TodoItem, MicroChallengeState } from '@/types';
import { handleGenerateWeeklySummaryAction } from '@/app/actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { isSameDay, subDays, startOfDay, parseISO } from 'date-fns';

interface FlashSummaryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const initialChallengeState: MicroChallengeState = {
  date: '',
  challenges: [],
  streak: 0,
  points: 0
};

export function FlashSummaryDialog({ isOpen, onOpenChange }: FlashSummaryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const [microChallengeState] = useLocalStorage<MicroChallengeState>('sevenk-micro-challenges', initialChallengeState);
  const [todos] = useLocalStorage<TodoItem[]>('sevenk-todos', []);
  const [journalEntries] = useLocalStorage<JournalEntry[]>('sevenk-journal', []);

  useEffect(() => {
    if (isOpen) {
      const fetchSummary = async () => {
        setIsLoading(true);
        setAiSummary(null);

        const sevenDaysAgo = subDays(new Date(), 7);

        const completedTodayCount = microChallengeState.challenges.filter(c => c.completed).length;
        const challengeSummary = `Current streak: ${microChallengeState.streak} days. ${completedTodayCount}/${microChallengeState.challenges.length} challenges completed today. Total points: ${microChallengeState.points}.`;
        
        const recentTodos = todos.filter(t => t.dueDate && new Date(t.dueDate) > sevenDaysAgo);
        const todoSummary = recentTodos.length > 0 ? `Total: ${recentTodos.length}, Completed: ${recentTodos.filter(t => t.completed).length}` : "No tasks with due dates in the last week.";

        const recentJournal = journalEntries.filter(j => new Date(j.date) > sevenDaysAgo);
        const moodSummary = recentJournal.length > 0 ? `Logged ${recentJournal.length} entries. Moods: ${recentJournal.map(j => j.mood).filter(Boolean).join(', ')}` : "No journal entries in the last week.";
        
        const result = await handleGenerateWeeklySummaryAction({
          challengeData: challengeSummary,
          todoData: todoSummary,
          journalData: moodSummary,
        });
        
        setIsLoading(false);
        if ('summary' in result) {
          setAiSummary(result.summary);
        } else {
          setAiSummary("Could not generate a summary at this time.");
        }
      };
      fetchSummary();
    }
  }, [isOpen, microChallengeState, todos, journalEntries]);

  const challengesToCompleteToday = useMemo(() => {
    return microChallengeState.challenges.filter(c => !c.completed);
  }, [microChallengeState]);

  const today = startOfDay(new Date());
  const todaysGoals = useMemo(() => {
    return todos.filter(t => !t.completed && t.dueDate && isSameDay(parseISO(t.dueDate), today));
  }, [todos, today]);

  const yesterdaysHighlight = useMemo(() => {
    const yesterday = startOfDay(subDays(new Date(), 1));
    const yesterdayEntries = journalEntries
        .filter(entry => isSameDay(parseISO(entry.date), yesterday))
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return yesterdayEntries.length > 0 ? yesterdayEntries[0] : null;
  }, [journalEntries]);

  const moodData = useMemo(() => {
    const sevenDaysAgo = subDays(new Date(), 7);
    const recentEntries = journalEntries.filter(j => new Date(j.date) > sevenDaysAgo && j.mood);
    
    const moodCounts = recentEntries.reduce((acc, entry) => {
      const mood = entry.mood!.trim();
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(moodCounts).map(([mood, count]) => ({ mood, count }));
  }, [journalEntries]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-primary">
            <Zap className="w-6 h-6" /> Flash Summary
          </DialogTitle>
          <DialogDescription>Your quick snapshot for today and the past week.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 py-4">
            
            <div className="p-4 rounded-lg bg-card-foreground/5 border border-primary/20">
              <h3 className="font-semibold text-lg mb-2 text-primary">AI Weekly Summary</h3>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              ) : (
                <p className="text-sm">{aiSummary}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><ListTodo className="w-5 h-5 text-primary" />Today's Goals</h3>
                {todaysGoals.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {todaysGoals.map(t => <li key={t.id}>{t.task}</li>)}
                  </ul>
                ) : <p className="text-sm text-muted-foreground">No goals set for today. Go add some!</p>}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Trophy className="w-5 h-5 text-primary" />Today's Challenges</h3>
                {challengesToCompleteToday.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {challengesToCompleteToday.map(c => <li key={c.text}>{c.text}</li>)}
                  </ul>
                ) : <p className="text-sm text-muted-foreground">All challenges are complete. Great job!</p>}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-primary" />Weekly Mood Graph</h3>
              {moodData.length > 0 ? (
                <ChartContainer config={{}} className="h-[200px] w-full">
                  <BarChart data={moodData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mood" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={20}/>
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--card))' }}
                      content={<ChartTooltipContent />}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              ) : <p className="text-sm text-muted-foreground">No moods logged in the past week to create a graph.</p>}
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Smile className="w-5 h-5 text-primary" />Yesterday's Highlight</h3>
              {yesterdaysHighlight ? (
                 <p className="text-sm text-muted-foreground p-3 bg-card-foreground/5 rounded-md border italic">"{yesterdaysHighlight.text}"</p>
              ) : <p className="text-sm text-muted-foreground">No journal entry from yesterday.</p>}
            </div>

          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
