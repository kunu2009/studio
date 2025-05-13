"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BookText, Save, History as HistoryIcon } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { JournalEntry } from '@/types';

interface JournalProps {
  onViewHistory: () => void;
}

export function Journal({ onViewHistory }: JournalProps) {
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>('zenith-journal', []);
  const [currentEntry, setCurrentEntry] = useState('');
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
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      text: currentEntry.trim(),
    };
    setJournalEntries(prevEntries => [newEntry, ...prevEntries]); // Add to the beginning
    setCurrentEntry('');
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
          className="min-h-[150px] mb-4"
          aria-label="Journal input"
        />
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
