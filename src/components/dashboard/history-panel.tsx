"use client";

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { JournalEntry } from '@/types';
import { CalendarDays, Smile, Tag, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HistoryPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  entries: JournalEntry[];
}

export function HistoryPanel({ isOpen, onOpenChange, entries }: HistoryPanelProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-2xl text-primary">Journal History</SheetTitle>
          <SheetDescription>Review your past journal entries.</SheetDescription>
        </SheetHeader>
        <Separator />
        <ScrollArea className="flex-grow p-6">
          {entries.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No journal entries yet.</p>
          ) : (
            <div className="space-y-6">
              {entries.map(entry => (
                <div key={entry.id} className="p-4 rounded-lg border bg-card-foreground/5 shadow-sm">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      <span>{new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {entry.mood && (
                      <div className="flex items-center gap-1">
                        <Smile className="w-4 h-4" /> 
                        <span>{entry.mood}</span>
                      </div>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed mb-2">{entry.text}</p>
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      {entry.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <Separator />
        <SheetFooter className="p-6 pt-4">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
