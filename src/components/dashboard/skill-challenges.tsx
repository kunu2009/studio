"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import type { SkillChallenge } from '@/types';
import { Flame, Plus, Trash2, Trophy } from 'lucide-react';
import { isToday, isYesterday, parseISO } from 'date-fns';

export function SkillChallenges() {
  const [challenges, setChallenges] = useLocalStorage<SkillChallenge[]>('sevenk-skill-challenges', []);
  const [newChallengeName, setNewChallengeName] = useState('');
  const { toast } = useToast();

  const handleAddChallenge = () => {
    if (!newChallengeName.trim()) {
      toast({ title: 'Challenge name is required.', variant: 'destructive' });
      return;
    }

    const newChallenge: SkillChallenge = {
      id: crypto.randomUUID(),
      name: newChallengeName.trim(),
      streak: 0,
    };

    setChallenges(prev => [...prev, newChallenge]);
    toast({ title: `Challenge "${newChallenge.name}" added.` });
    setNewChallengeName('');
  };

  const handleRemoveChallenge = (id: string) => {
    setChallenges(prev => prev.filter(challenge => challenge.id !== id));
  };

  const handleCompleteChallenge = (id: string) => {
    setChallenges(prev =>
      prev.map(challenge => {
        if (challenge.id === id) {
          const today = new Date();
          const lastCompleted = challenge.lastCompletedDate ? parseISO(challenge.lastCompletedDate) : null;

          if (lastCompleted && isToday(lastCompleted)) {
            toast({ title: "Already completed today!", description: "Great job, come back tomorrow." });
            return challenge; // Already completed today
          }

          let newStreak = 1;
          if (lastCompleted && isYesterday(lastCompleted)) {
            newStreak = challenge.streak + 1; // It's a streak!
          }
          
          toast({ title: "Challenge Complete!", description: newStreak > 1 ? `You're on a ${newStreak}-day streak!` : "A new streak begins!" });

          return { ...challenge, streak: newStreak, lastCompletedDate: today.toISOString() };
        }
        return challenge;
      })
    );
  };
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-primary">
          <Trophy className="w-6 h-6" />
          Mini Skill Challenges
        </CardTitle>
        <CardDescription>Small daily actions for big growth. Track your streaks!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
            <Input
              value={newChallengeName}
              onChange={(e) => setNewChallengeName(e.target.value)}
              placeholder="e.g., Learn one new word"
              onKeyDown={(e) => e.key === 'Enter' && handleAddChallenge()}
            />
            <Button onClick={handleAddChallenge} aria-label="Add Challenge">
                <Plus className="w-4 h-4" />
            </Button>
        </div>
        <div className="space-y-3 h-[250px] overflow-y-auto pr-3">
          {challenges.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-muted-foreground">No challenges yet. Add one to get started!</p>
            </div>
          ) : (
            challenges.map(challenge => {
              const completedToday = challenge.lastCompletedDate && isToday(parseISO(challenge.lastCompletedDate));
              return (
                <div key={challenge.id} className="p-4 rounded-lg border bg-card-foreground/5 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{challenge.name}</p>
                    <div className="flex items-center gap-1.5 text-sm text-amber-400">
                        <Flame className="w-4 h-4" />
                        <span>{challenge.streak} Day Streak</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                     <Button 
                        size="sm" 
                        onClick={() => handleCompleteChallenge(challenge.id)}
                        disabled={completedToday}
                        variant={completedToday ? "secondary" : "default"}
                    >
                        {completedToday ? "Done!" : "Complete"}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80" onClick={() => handleRemoveChallenge(challenge.id)} aria-label={`Remove challenge: ${challenge.name}`}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
