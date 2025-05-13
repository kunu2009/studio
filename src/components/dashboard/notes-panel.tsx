"use client";

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import type { AdvancedNote } from '@/types';
import { FileText, Save, X } from 'lucide-react';

interface NotesPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const initialNote: AdvancedNote = {
  id: 'main-note',
  content: '',
  lastModified: new Date().toISOString(),
};

export function NotesPanel({ isOpen, onOpenChange }: NotesPanelProps) {
  const [note, setNote] = useLocalStorage<AdvancedNote>('zenith-advanced-note', initialNote);
  const { toast } = useToast();

  const handleSaveNote = () => {
    setNote(prev => ({ ...prev, lastModified: new Date().toISOString() }));
    toast({
      title: "Note Saved",
      description: "Your advanced note has been updated.",
    });
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(prev => ({ ...prev, content: e.target.value }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-2xl text-primary flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Advanced Notes
          </SheetTitle>
          <SheetDescription>Jot down your detailed thoughts and ideas.</SheetDescription>
        </SheetHeader>
        
        <Textarea
          value={note.content}
          onChange={handleNoteChange}
          placeholder="Start typing your advanced notes here..."
          className="flex-grow m-6 mt-0 mb-2 rounded-md resize-none border-input focus:ring-primary"
          aria-label="Advanced notes input"
        />
        <p className="text-xs text-muted-foreground px-6 mb-4">
          Last saved: {new Date(note.lastModified).toLocaleString()}
        </p>
        
        <SheetFooter className="p-6 pt-0 border-t mt-auto">
          <div className="flex justify-between w-full">
            <SheetClose asChild>
              <Button variant="outline">
                 <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </SheetClose>
            <Button onClick={handleSaveNote}>
              <Save className="w-4 h-4 mr-2" />
              Save Note
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
