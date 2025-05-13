"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BookText, Save, History as HistoryIcon, Smile, Tags } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { JournalEntry } from '@/types';

interface JournalProps {
  onViewHistory: () => void;
}

export function Journal({ onViewHistory }: JournalProps) {
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>('sevenk-journal', []);
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentMood, setCurrentMood] = useState('');
  const [currentTags, setCurrentTags] = useState(''); // Comma-separated string
  const { toast } = useToast();

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
        <Textarea
          value={currentEntry}
          onChange={(e) => setCurrentEntry(e.target.value)}
          placeholder="Write your thoughts here..."
          className="min-h-[120px] mb-4" // Adjusted height
          aria-label="Journal input"
        />
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
