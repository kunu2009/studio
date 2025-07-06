"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import type { MicroChallenge, MicroChallengeState } from '@/types';
import { handleGenerateMicroChallengesAction } from '@/app/actions';
import { Flame, Star, Shield, ShieldCheck, Medal, Award, Trophy, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';

const getRank = (points: number) => {
    if (points >= 1000) return { name: "Master", icon: <Award className="w-4 h-4" />, color: "text-amber-400" };
    if (points >= 500) return { name: "Journeyman", icon: <Medal className="w-4 h-4" />, color: "text-slate-400" };
    if (points >= 100) return { name: "Apprentice", icon: <ShieldCheck className="w-4 h-4" />, color: "text-yellow-600" };
    return { name: "Novice", icon: <Shield className="w-4 h-4" />, color: "text-muted-foreground" };
};

const initialChallengeState: MicroChallengeState = {
    date: '',
    challenges: [],
    streak: 0,
    points: 0
};

export function MicroChallenges() {
    const [state, setState] = useLocalStorage<MicroChallengeState>('sevenk-micro-challenges', initialChallengeState);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const todayStr = new Date().toISOString().split('T')[0];

    const generateNewChallenges = useCallback(async () => {
        setIsLoading(true);
        const result = await handleGenerateMicroChallengesAction({ count: 3 });

        if ('error' in result) {
            toast({ title: 'AI Error', description: 'Could not fetch new challenges.', variant: 'destructive' });
            setIsLoading(false);
            return;
        }

        const newChallenges: MicroChallenge[] = result.challenges.map(text => ({ text, completed: false }));

        setState(prevState => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            const allPrevChallengesCompleted = prevState.challenges.every(c => c.completed);
            const isConsecutiveDay = prevState.date === yesterday.toISOString().split('T')[0];

            let newStreak = 0;
            if (prevState.date === todayStr) {
                // If we're re-rolling on the same day, don't change streak.
                newStreak = prevState.streak;
            } else if (isConsecutiveDay && allPrevChallengesCompleted) {
                newStreak = prevState.streak + 1;
                toast({ title: 'Streak Extended!', description: `You're on a ${newStreak}-day streak!` });
            } else if (allPrevChallengesCompleted && prevState.challenges.length > 0) {
                newStreak = 1; // Started a new streak
            }

            return {
                ...prevState,
                date: todayStr,
                challenges: newChallenges,
                streak: newStreak
            };
        });

        setIsLoading(false);
    }, [setState, todayStr, toast]);

    useEffect(() => {
        if (state.date !== todayStr) {
            generateNewChallenges();
        }
    }, [state.date, todayStr, generateNewChallenges]);

    const handleChallengeToggle = (index: number, completed: boolean) => {
        setState(prevState => {
            const newChallenges = [...prevState.challenges];
            const wasCompleted = newChallenges[index].completed;
            
            // Prevent reducing points if already completed
            if (wasCompleted && !completed) return prevState;

            newChallenges[index] = { ...newChallenges[index], completed };
            
            const newPoints = completed ? prevState.points + 10 : prevState.points;
            if(completed) {
                toast({ title: "+10 Points!", description: newChallenges[index].text});
            }

            return {
                ...prevState,
                challenges: newChallenges,
                points: newPoints
            };
        });
    };

    const rank = useMemo(() => getRank(state.points), [state.points]);
  
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-primary">
                    <Trophy className="w-6 h-6" />
                    Micro Challenges
                </CardTitle>
                <CardDescription>Small daily actions to build momentum.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-around items-center p-3 rounded-lg bg-card-foreground/5 text-center">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold text-lg">
                            <Flame className="w-5 h-5" />
                            <span>{state.streak}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Day Streak</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-lg">
                            <Star className="w-5 h-5" />
                            <span>{state.points}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Points</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={`flex items-center gap-1.5 font-bold text-lg ${rank.color}`}>
                            {rank.icon}
                            <span>{rank.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Rank</p>
                    </div>
                </div>

                <div className="space-y-3 min-h-[150px] flex flex-col justify-center">
                    {isLoading ? (
                         <div className="flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                    ) : state.challenges.length === 0 ? (
                        <div className="text-center text-muted-foreground">No challenges loaded.</div>
                    ) : (
                        state.challenges.map((challenge, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-card-foreground/5">
                                <Checkbox 
                                    id={`challenge-${index}`}
                                    checked={challenge.completed}
                                    onCheckedChange={(checked) => handleChallengeToggle(index, !!checked)}
                                />
                                <Label htmlFor={`challenge-${index}`} className={`text-sm ${challenge.completed ? 'line-through text-muted-foreground' : ''}`}>
                                    {challenge.text}
                                </Label>
                            </div>
                        ))
                    )}
                </div>
                <Button variant="outline" size="sm" onClick={generateNewChallenges} disabled={isLoading} className="w-full">
                    <Loader2 className={`w-4 h-4 mr-2 ${!isLoading && 'hidden'}`} />
                    Get New Challenges
                </Button>
            </CardContent>
        </Card>
    );
}
