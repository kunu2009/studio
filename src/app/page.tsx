"use client";

import React, { useState, useEffect } from 'react';
import { GlowUpDisplay } from '@/components/dashboard/glow-up-display';
import { TodoList } from '@/components/dashboard/todo-list';
import { Journal } from '@/components/dashboard/journal';
import { AiAssistantDialog } from '@/components/dashboard/ai-assistant-dialog';
import { HistoryPanel } from '@/components/dashboard/history-panel';
import { NotesPanel } from '@/components/dashboard/notes-panel';
import { Button } from '@/components/ui/button';
import { Bot, FileText, History as HistoryIcon, PanelLeftOpen, PanelRightOpen } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { JournalEntry } from '@/types';

export default function ZenithZonePage() {
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  const [isNotesPanelOpen, setIsNotesPanelOpen] = useState(false);
  
  // Use a state variable to ensure journalEntries are loaded client-side before passing to HistoryPanel
  const [loadedJournalEntries, setLoadedJournalEntries] = useState<JournalEntry[]>([]);
  const [journalEntriesFromStorage] = useLocalStorage<JournalEntry[]>('zenith-journal', []);

  useEffect(() => {
    setLoadedJournalEntries(journalEntriesFromStorage);
  }, [journalEntriesFromStorage]);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GlowUpDisplay />
        </div>
        <div className="lg:col-span-1">
          <TodoList />
        </div>
        <div className="lg:col-span-1">
          <Journal onViewHistory={() => setIsHistoryPanelOpen(true)} />
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
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

       <div className="fixed bottom-6 left-6 z-50 flex flex-col-reverse md:flex-row gap-3 items-start md:items-center">
        <Button
          variant="outline"
          onClick={() => setIsNotesPanelOpen(true)}
          aria-label="Open Advanced Notes"
          className="shadow-lg"
        >
          <PanelRightOpen className="w-5 h-5 mr-0 md:mr-2" />
          <span className="hidden md:inline">Notes</span>
        </Button>
         {/* History button already in Journal component, but can add a global one if needed */}
         {/* Example: 
            <Button 
              variant="outline" 
              onClick={() => setIsHistoryPanelOpen(true)} 
              aria-label="Open Journal History"
              className="shadow-lg"
            >
              <PanelLeftOpen className="w-5 h-5 mr-0 md:mr-2" />
              <span className="hidden md:inline">History</span>
            </Button> 
         */}
      </div>


      <AiAssistantDialog isOpen={isAiDialogOpen} onOpenChange={setIsAiDialogOpen} />
      <HistoryPanel 
        isOpen={isHistoryPanelOpen} 
        onOpenChange={setIsHistoryPanelOpen}
        entries={loadedJournalEntries}
      />
      <NotesPanel isOpen={isNotesPanelOpen} onOpenChange={setIsNotesPanelOpen} />
    </div>
  );
}
