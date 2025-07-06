"use client";

import React, { useState, useEffect } from 'react';
import { TodoList } from '@/components/dashboard/todo-list';
import { Journal } from '@/components/dashboard/journal';
import { AiAssistantDialog } from '@/components/dashboard/ai-assistant-dialog';
import { HistoryPanel } from '@/components/dashboard/history-panel';
import { NotesPanel } from '@/components/dashboard/notes-panel';
import { FlashSummaryDialog } from '@/components/dashboard/flash-summary-dialog';
import { PomodoroTimer } from '@/components/dashboard/pomodoro-timer';
import { MicroChallenges } from '@/components/dashboard/micro-challenges';
import { Button } from '@/components/ui/button';
import { Bot, PanelRightOpen, Zap } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { JournalEntry } from '@/types';

export default function SevenKLifePage() {
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  const [isNotesPanelOpen, setIsNotesPanelOpen] = useState(false);
  const [isFlashSummaryOpen, setIsFlashSummaryOpen] = useState(false);
  
  const [loadedJournalEntries, setLoadedJournalEntries] = useState<JournalEntry[]>([]);
  const [journalEntriesFromStorage] = useLocalStorage<JournalEntry[]>('sevenk-journal', []);

  useEffect(() => {
    setLoadedJournalEntries(journalEntriesFromStorage);
  }, [journalEntriesFromStorage]);


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, here's your overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <TodoList />
          <PomodoroTimer />
        </div>
        <div className="space-y-6">
          <MicroChallenges />
          <Journal onViewHistory={() => setIsHistoryPanelOpen(true)} />
        </div>
      </div>

      <div className="fixed bottom-20 right-6 z-50 flex flex-col gap-3 items-end md:bottom-6">
        <Button
            variant="secondary"
            size="lg"
            className="rounded-full shadow-xl w-16 h-16 p-0"
            onClick={() => setIsFlashSummaryOpen(true)}
            aria-label="Open Flash Summary"
            >
            <Zap className="w-7 h-7" />
        </Button>
         <Button
          variant="default"
          size="lg"
          className="rounded-full shadow-xl w-16 h-16 p-0"
          onClick={() => setIsAiDialogOpen(true)}
          aria-label="Open AI Assistant"
        >
          <Bot className="w-7 h-7" />
        </Button>
      </div>

       <div className="fixed bottom-20 left-6 z-50 flex flex-col-reverse md:flex-row gap-3 items-start md:items-center md:bottom-6">
        <Button
          variant="outline"
          onClick={() => setIsNotesPanelOpen(true)}
          aria-label="Open Advanced Notes"
          className="shadow-lg"
        >
          <PanelRightOpen className="w-5 h-5 mr-0 md:mr-2" />
          <span className="hidden md:inline">Notes</span>
        </Button>
      </div>


      <AiAssistantDialog isOpen={isAiDialogOpen} onOpenChange={setIsAiDialogOpen} />
      <HistoryPanel 
        isOpen={isHistoryPanelOpen} 
        onOpenChange={setIsHistoryPanelOpen}
        entries={loadedJournalEntries}
      />
      <NotesPanel isOpen={isNotesPanelOpen} onOpenChange={setIsNotesPanelOpen} />
      <FlashSummaryDialog isOpen={isFlashSummaryOpen} onOpenChange={setIsFlashSummaryOpen} />
    </div>
  );
}
