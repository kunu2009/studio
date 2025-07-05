"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BookText, Save, History as HistoryIcon, Smile, Tags, Lightbulb } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { JournalEntry } from '@/types';

const dailyPrompts = [
    "What was the best part of your day?",
    "What is one thing you're grateful for today?",
    "Describe a challenge you faced today.",
    "What's something that made you smile today?",
    "What are you looking forward to tomorrow?",
    "If you could do one thing over today, what would it be?",
    "What did you learn today?",
    "Who did you interact with today that left an impression?",
    "What's a simple pleasure you enjoyed today?",
    "How did you take care of yourself today?",
];

const getDayOfYear = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};

export function Journal({ onViewHistory }: JournalProps) {
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>('sevenk-journal', []);
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentMood, setCurrentMood] = useState('');
  const [currentTags, setCurrentTags] = useState('');
  const { toast } = useToast();

  const dailyPrompt = useMemo(() => {
    const dayIndex = getDayOfYear(new Date());
    return dailyPrompts[dayIndex % dailyPrompts.length];
  }, []);

  const wordCount = useMemo(() => {
    return currentEntry.trim() === '' ? 0 : currentEntry.trim().split(/\s+/).length;
  }, [currentEntry]);

  const handleSaveEntry = () => {
    if (currentEntry.trim() === '') {
      toast({
        title: "Empty Entry",
        description: "Cannot save an empty journal entry.",
        variant: "destructive",
      });
      return;
    }
    
    const tagsArray = currentTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      text: currentEntry.trim(),
      mood: currentMood.trim() || undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
    };
    setJournalEntries(prevEntries => [newEntry, ...prevEntries]);
    setCurrentEntry('');
    setCurrentMood('');
    setCurrentTags('');
    toast({
      title: "Journal Entry Saved",
      description: "Your thoughts have been recorded.",
    });
  };
  
  const handlePromptClick = () => {
    if (currentEntry.trim() === '') {
      setCurrentEntry(dailyPrompt + " ");
    } else {
      setCurrentEntry(prev => prev + "\n\n" + dailyPrompt + " ");
    }
    // Focus the textarea
    document.getElementById('journal-entry')?.focus();
  }


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-primary">
          <BookText className="w-6 h-6" />
          Journal
        </CardTitle>
        <CardDescription>Reflect on your day, thoughts, and experiences.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-3 mb-4 rounded-md border border-dashed border-primary/50 bg-primary/10">
          <p className="text-sm text-primary flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <span>Daily Prompt: <button onClick={handlePromptClick} className="font-semibold hover:underline focus:outline-none">{dailyPrompt}</button></span>
          </p>
        </div>
        <div className="relative">
            <Textarea
              id="journal-entry"
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              placeholder="Write your thoughts here..."
              className="min-h-[120px] mb-4 pr-16"
              aria-label="Journal input"
            />
            <div className="absolute bottom-6 right-2 text-xs text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-sm">
                {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="journal-mood" className="flex items-center gap-1 mb-1 text-sm">
              <Smile className="w-4 h-4 text-muted-foreground" /> Mood (optional)
            </Label>
            <Input
              id="journal-mood"
              value={currentMood}
              onChange={(e) => setCurrentMood(e.target.value)}
              placeholder="e.g., Happy, Productive, Calm"
              aria-label="Journal mood"
            />
          </div>
          <div>
            <Label htmlFor="journal-tags" className="flex items-center gap-1 mb-1 text-sm">
              <Tags className="w-4 h-4 text-muted-foreground" /> Tags (comma-separated)
            </Label>
            <Input
              id="journal-tags"
              value={currentTags}
              onChange={(e) => setCurrentTags(e.target.value)}
              placeholder="e.g., work, reflection, idea"
              aria-label="Journal tags"
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Button onClick={onViewHistory} variant="outline">
            <HistoryIcon className="w-4 h-4 mr-2" />
            View History
          </Button>
          <Button onClick={handleSaveEntry}>
            <Save className="w-4 h-4 mr-2" />
            Save Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
