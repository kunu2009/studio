"use client";

import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, ListPlus, BookOpenText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import type { JournalEntry, TodoItem } from '@/types';
import { handleGenerateTodoListAction, handleSummarizeJournalAction } from '@/app/actions';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AiAssistantDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

type AiAction = 'generateTodo' | 'summarizeJournal' | null;

export function AiAssistantDialog({ isOpen, onOpenChange }: AiAssistantDialogProps) {
  const [selectedAction, setSelectedAction] = useState<AiAction>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | string[] | null>(null);
  const { toast } = useToast();
  const [journalEntries] = useLocalStorage<JournalEntry[]>('zenith-journal', []);
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('zenith-todos', []);


  const resetDialog = () => {
    setSelectedAction(null);
    setPrompt('');
    setAiResponse(null);
    setIsLoading(false);
  };

  const handleOpenChangeWithReset = (open: boolean) => {
    if (!open) {
      resetDialog();
    }
    onOpenChange(open);
  };

  const handleGenerateTodo = async () => {
    if (!prompt.trim()) {
      toast({ title: "Prompt is empty", description: "Please provide a prompt for To-Do list generation.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setAiResponse(null);
    const result = await handleGenerateTodoListAction({ prompt });
    setIsLoading(false);
    if ('error' in result) {
      toast({ title: "AI Error", description: result.error, variant: "destructive" });
    } else {
      setAiResponse(result.todoList);
      toast({ title: "To-Do List Generated", description: "Review the suggestions below." });
    }
  };

  const handleAddSuggestedTodos = () => {
    if (Array.isArray(aiResponse)) {
      const newTodos: TodoItem[] = aiResponse.map(task => ({
        id: crypto.randomUUID(),
        task,
        completed: false,
      }));
      setTodos(prev => [...prev, ...newTodos]);
      toast({ title: "Tasks Added", description: `${newTodos.length} tasks added to your list.` });
      setAiResponse(null); // Clear suggestions after adding
    }
  };

  const handleSummarizeJournal = async () => {
    if (journalEntries.length === 0) {
      toast({ title: "No Journal Entries", description: "Write some journal entries first to get a summary.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setAiResponse(null);
    const entriesText = journalEntries.map(entry => `Date: ${new Date(entry.date).toLocaleDateString()}\n${entry.text}`).join('\n\n---\n\n');
    const result = await handleSummarizeJournalAction({ journalEntries: entriesText });
    setIsLoading(false);
    if ('error' in result) {
      toast({ title: "AI Error", description: result.error, variant: "destructive" });
    } else {
      setAiResponse(result.summary);
      toast({ title: "Journal Summary Generated", description: "Review your summary below." });
    }
  };


  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-40"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
    }

    if (aiResponse) {
      return (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">{selectedAction === 'generateTodo' ? "Suggested To-Do Items:" : "Journal Summary:"}</h3>
          <ScrollArea className="h-60 p-2 border rounded-md bg-card-foreground/5">
            {Array.isArray(aiResponse) ? (
              <ul className="list-disc list-inside space-y-1">
                {aiResponse.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            ) : (
              <p className="whitespace-pre-wrap">{aiResponse}</p>
            )}
          </ScrollArea>
          {selectedAction === 'generateTodo' && Array.isArray(aiResponse) && aiResponse.length > 0 && (
             <Button onClick={handleAddSuggestedTodos} className="w-full">
                <ListPlus className="w-4 h-4 mr-2" /> Add to My To-Do List
            </Button>
          )}
           <Button variant="outline" onClick={resetDialog} className="w-full">Start Over</Button>
        </div>
      );
    }

    if (selectedAction === 'generateTodo') {
      return (
        <div className="space-y-4">
          <DialogDescription>Enter a prompt to generate To-Do list ideas (e.g., "Plan a productive weekend", "Tasks for learning Next.js").</DialogDescription>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Morning routine for success"
            rows={3}
            className="resize-none"
          />
          <Button onClick={handleGenerateTodo} className="w-full">
            <Wand2 className="w-4 h-4 mr-2" /> Generate Ideas
          </Button>
        </div>
      );
    }

    if (selectedAction === 'summarizeJournal') {
      return (
        <div className="space-y-4">
          <DialogDescription>Get an AI-powered summary of your existing journal entries. Make sure you have some entries saved.</DialogDescription>
          {journalEntries.length > 0 ?
             <p className="text-sm text-muted-foreground">Found {journalEntries.length} journal entries.</p>
            : <p className="text-sm text-destructive">No journal entries found. Please add some first.</p>
          }
          <Button onClick={handleSummarizeJournal} disabled={journalEntries.length === 0} className="w-full">
            <BookOpenText className="w-4 h-4 mr-2" /> Summarize My Journal
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <DialogDescription>What would you like the AI assistant to help you with?</DialogDescription>
        <Button onClick={() => setSelectedAction('generateTodo')} variant="outline" className="w-full justify-start p-4 h-auto">
          <ListPlus className="w-5 h-5 mr-3 text-primary" />
          <div>
            <p className="font-semibold">Generate To-Do List Ideas</p>
            <p className="text-xs text-muted-foreground text-left">Get suggestions for tasks based on a prompt.</p>
          </div>
        </Button>
        <Button onClick={() => setSelectedAction('summarizeJournal')} variant="outline" className="w-full justify-start p-4 h-auto">
          <BookOpenText className="w-5 h-5 mr-3 text-primary" />
           <div>
            <p className="font-semibold">Summarize My Journal</p>
            <p className="text-xs text-muted-foreground text-left">Identify recurring themes in your entries.</p>
          </div>
        </Button>
      </div>
    );
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChangeWithReset}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-primary">
            <Wand2 className="w-6 h-6" /> AI Assistant
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
         {renderContent()}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              <X className="w-4 h-4 mr-2" />
              {aiResponse || selectedAction ? "Back" : "Cancel"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
