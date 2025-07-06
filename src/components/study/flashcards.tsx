"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Flashcard } from '@/types';
import { calculateNextReview } from '@/lib/srs';
import { Plus, Trash2, Check, X, Ban, BookOpen, Repeat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '../ui/scroll-area';

export function Flashcards() {
  const [flashcards, setFlashcards] = useLocalStorage<Flashcard[]>('sevenk-flashcards', []);
  const { toast } = useToast();

  // State for the component
  const [view, setView] = useState<'review' | 'manage'>('review');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // State for creating a new flashcard
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newSubject, setNewSubject] = useState('');

  const dueForReview = useMemo(() => {
    const now = new Date();
    return flashcards.filter(card => new Date(card.nextReview) <= now)
        .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());
  }, [flashcards]);

  useEffect(() => {
    // Reset index if the list of due cards changes
    setCurrentCardIndex(0);
  }, [dueForReview.length]);

  const currentCard = dueForReview[currentCardIndex];

  const handleCreateFlashcard = () => {
    if (!newQuestion.trim() || !newAnswer.trim() || !newSubject.trim()) {
      toast({ title: "All fields are required.", variant: 'destructive' });
      return;
    }

    const newCard: Flashcard = {
      id: crypto.randomUUID(),
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      subject: newSubject.trim(),
      repetition: 0,
      easeFactor: 2.5,
      nextReview: new Date().toISOString(), // Ready for review immediately
    };
    
    setFlashcards(prev => [...prev, newCard]);
    toast({ title: "Flashcard created!" });
    setNewQuestion('');
    setNewAnswer('');
    setNewSubject('');
  };

  const handleDeleteFlashcard = (id: string) => {
    setFlashcards(prev => prev.filter(card => card.id !== id));
    toast({ title: "Flashcard deleted.", variant: "destructive" });
  };
  
  const handleReviewDecision = (quality: 0 | 1 | 2) => {
    if (!currentCard) return;

    const updatedCard = calculateNextReview(currentCard, quality);
    setFlashcards(prev => prev.map(card => card.id === updatedCard.id ? updatedCard : card));
    setIsFlipped(false);

    if (currentCardIndex >= dueForReview.length - 1) {
        // Last card was just reviewed
        toast({ title: "Review session complete!" });
    } else {
        setCurrentCardIndex(prev => prev + 1);
    }
  };

  const renderReviewView = () => {
    if (dueForReview.length === 0) {
      return (
        <div className="text-center space-y-4 py-10">
          <Check className="w-16 h-16 text-green-500 mx-auto" />
          <h3 className="text-2xl font-bold">All caught up!</h3>
          <p className="text-muted-foreground">You have no flashcards due for review right now.</p>
          <Button onClick={() => setView('manage')}>Manage Flashcards</Button>
        </div>
      );
    }
    
    return (
        <div className="space-y-4 flex flex-col items-center">
            <p className="text-sm text-muted-foreground">Cards to review: {dueForReview.length - currentCardIndex}</p>
            <div className="relative w-full h-64 perspective-1000">
                <div
                    className={`absolute w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                >
                    {/* Front of card */}
                    <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-6 border rounded-lg bg-card text-card-foreground shadow-lg">
                        <Badge variant="secondary" className="absolute top-3 right-3">{currentCard.subject}</Badge>
                        <p className="text-lg font-semibold text-center">{currentCard.question}</p>
                    </div>
                    {/* Back of card */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-6 border rounded-lg bg-secondary text-secondary-foreground shadow-lg">
                        <p className="text-lg text-center">{currentCard.answer}</p>
                    </div>
                </div>
            </div>

            {!isFlipped ? (
                <Button onClick={() => setIsFlipped(true)} className="w-full">Show Answer</Button>
            ) : (
                <div className="grid grid-cols-3 gap-2 w-full">
                    <Button variant="destructive" onClick={() => handleReviewDecision(0)}>
                        <X className="w-4 h-4 mr-2" /> Again
                    </Button>
                    <Button variant="outline" onClick={() => handleReviewDecision(1)}>
                        <Ban className="w-4 h-4 mr-2" /> Good
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleReviewDecision(2)}>
                        <Check className="w-4 h-4 mr-2" /> Easy
                    </Button>
                </div>
            )}
        </div>
    );
  };
  
  const renderManageView = () => {
    return (
      <div className="space-y-6">
        <Card className="bg-card-foreground/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> Create New Flashcard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="new-question">Question</Label>
              <Textarea id="new-question" value={newQuestion} onChange={e => setNewQuestion(e.target.value)} placeholder="e.g., What is the capital of Japan?" />
            </div>
            <div>
              <Label htmlFor="new-answer">Answer</Label>
              <Textarea id="new-answer" value={newAnswer} onChange={e => setNewAnswer(e.target.value)} placeholder="e.g., Tokyo" />
            </div>
            <div>
              <Label htmlFor="new-subject">Subject</Label>
              <Input id="new-subject" value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="e.g., Geography" />
            </div>
            <Button onClick={handleCreateFlashcard} className="w-full">Create Card</Button>
          </CardContent>
        </Card>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">All Flashcards ({flashcards.length})</h3>
          <ScrollArea className="h-72 pr-4">
            <div className="space-y-2">
            {flashcards.length > 0 ? flashcards.map(card => (
              <div key={card.id} className="p-3 border rounded-lg flex justify-between items-center text-sm">
                <div className="flex-grow min-w-0">
                  <p className="font-medium truncate">{card.question}</p>
                  <p className="text-muted-foreground truncate">{card.answer}</p>
                </div>
                <div className="flex items-center flex-shrink-0 ml-4">
                    <Badge variant="outline">{card.subject}</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80" onClick={() => handleDeleteFlashcard(card.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
              </div>
            )) : <p className="text-center text-muted-foreground pt-10">No flashcards yet. Create one above!</p>}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="text-3xl">Flashcards</CardTitle>
            <Button variant="outline" onClick={() => setView(v => v === 'review' ? 'manage' : 'review')}>
                {view === 'review' ? <BookOpen className="w-4 h-4 mr-2" /> : <Repeat className="w-4 h-4 mr-2" />}
                {view === 'review' ? 'Manage Cards' : 'Review Cards'}
            </Button>
        </div>
        <CardDescription>
          {view === 'review' 
            ? 'Review cards due today using spaced repetition.' 
            : 'Create, edit, and delete your flashcards.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[400px]">
        {view === 'review' ? renderReviewView() : renderManageView()}
      </CardContent>
    </Card>
  );
}

// Add some CSS for the 3D card flip effect
const style = document.createElement('style');
style.innerHTML = `
  .perspective-1000 { perspective: 1000px; }
  .transform-style-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }
`;
document.head.appendChild(style);
