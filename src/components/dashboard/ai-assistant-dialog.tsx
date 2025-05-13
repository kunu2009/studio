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
import { Loader2, Wand2, ListPlus, BookOpenText, Lightbulb, X } from 'lucide-react'; // Added Lightbulb
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import type { JournalEntry, TodoItem } from '@/types';
import { handleGenerateTodoListAction, handleSummarizeJournalAction, handleExplainTopicAction } from '@/app/actions'; // Added handleExplainTopicAction
import { ScrollArea } from '@/components/ui/scroll-area';

interface AiAssistantDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

type AiAction = 'generateTodo' | 'summarizeJournal' | 'explainTopic' | null; // Added 'explainTopic'

export function AiAssistantDialog({ isOpen, onOpenChange }: AiAssistantDialogProps) {
  const [selectedAction, setSelectedAction] = useState<AiAction>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | string[] | null>(null);
  const { toast } = useToast();
  const [journalEntries] = useLocalStorage<JournalEntry[]>('sevenk-journal', []); // Updated key
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('sevenk-todos', []); // Updated key


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
      setAiResponse(null); 
    }
  };

  const handleSummarizeJournal = async () => {
    if (journalEntries.length === 0) {
      toast({ title: "No Journal Entries", description: "Write some journal entries first to get a summary.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setAiResponse(null);
    const entriesText = journalEntries.map(entry => `Date: ${new Date(entry.date).toLocaleDateString()}\nMood: ${entry.mood || 'N/A'}\nTags: ${entry.tags?.join(', ') || 'N/A'}\n${entry.text}`).join('\n\n---\n\n');
    const result = await handleSummarizeJournalAction({ journalEntries: entriesText });
    setIsLoading(false);
    if ('error' in result) {
      toast({ title: "AI Error", description: result.error, variant: "destructive" });
    } else {
      setAiResponse(result.summary);
      toast({ title: "Journal Summary Generated", description: "Review your summary below." });
    }
  };

  const handleExplainTopic = async () => {
    if (!prompt.trim()) {
      toast({ title: "Topic is empty", description: "Please provide a topic for explanation.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setAiResponse(null);
    const result = await handleExplainTopicAction({ topic: prompt });
    setIsLoading(false);
    if ('error' in result) {
      toast({ title: "AI Error", description: result.error, variant: "destructive" });
    } else {
      setAiResponse(result.explanation);
      toast({ title: "Topic Explanation Generated", description: "Review the explanation below." });
    }
  };


  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-40"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
    }

    if (aiResponse) {
      let title = "AI Response:";
      if (selectedAction === 'generateTodo') title = "Suggested To-Do Items:";
      if (selectedAction === 'summarizeJournal') title = "Journal Summary:";
      if (selectedAction === 'explainTopic') title = "Topic Explanation:";
      
      return (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">{title}</h3>
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

    if (selectedAction === 'explainTopic') {
      return (
        <div className="space-y-4">
          <DialogDescription>Enter a topic or question you want the AI to explain (e.g., "What is photosynthesis?", "Explain blockchain technology").</DialogDescription>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., The Theory of Relativity"
            rows={3}
            className="resize-none"
          />
          <Button onClick={handleExplainTopic} className="w-full">
            <Lightbulb className="w-4 h-4 mr-2" /> Explain Topic
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
        <Button onClick={() => setSelectedAction('explainTopic')} variant="outline" className="w-full justify-start p-4 h-auto">
          <Lightbulb className="w-5 h-5 mr-3 text-primary" />
           <div>
            <p className="font-semibold">Explain a Topic</p>
            <p className="text-xs text-muted-foreground text-left">Get explanations for concepts or questions.</p>
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
            <Button type="button" variant="ghost" onClick={() => { if (aiResponse || selectedAction) resetDialog(); else onOpenChange(false); }}>
              <X className="w-4 h-4 mr-2" />
              {aiResponse || selectedAction ? "Back" : "Cancel"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
