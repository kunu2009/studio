"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Clock, Play, Pause, RotateCcw, TimerIcon } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { TodoItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

const WORK_DURATION = 25 * 60; // 25 minutes
const SHORT_BREAK_DURATION = 5 * 60; // 5 minutes
const LONG_BREAK_DURATION = 15 * 60; // 15 minutes

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export function PomodoroTimer() {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('sevenk-todos', []);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [pomodoros, setPomodoros] = useState(0);
  const { toast } = useToast();

  const incompleteTodos = useMemo(() => todos.filter(todo => !todo.completed), [todos]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = useCallback((message: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('7K Life: Pomodoro', {
        body: message,
        icon: '/favicon.ico', // You might want a proper icon here
      });
    }
  }, []);

  const handleSessionEnd = useCallback(() => {
    setIsActive(false);
    toast({ title: "Session Over!", description: mode === 'work' ? "Time for a break." : "Break's over. Back to work!" });

    if (mode === 'work') {
      if (selectedTaskId) {
        setTodos(prev =>
          prev.map(t =>
            t.id === selectedTaskId
              ? { ...t, pomodorosCompleted: (t.pomodorosCompleted || 0) + 1 }
              : t
          )
        );
      }
      const newPomodoroCount = pomodoros + 1;
      setPomodoros(newPomodoroCount);
      if (newPomodoroCount % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(LONG_BREAK_DURATION);
        showNotification('Work session finished. Time for a long break!');
      } else {
        setMode('shortBreak');
        setTimeLeft(SHORT_BREAK_DURATION);
        showNotification('Work session finished. Time for a short break!');
      }
    } else {
      setMode('work');
      setTimeLeft(WORK_DURATION);
      showNotification("Break's over! Starting next work session.");
    }
  }, [mode, pomodoros, selectedTaskId, setTodos, toast, showNotification]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleSessionEnd();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, handleSessionEnd]);

  const toggleTimer = () => {
    if (!selectedTaskId && incompleteTodos.length > 0) {
      toast({ title: 'No task selected', description: 'Please link a task to your session.', variant: 'destructive' });
      return;
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setTimeLeft(WORK_DURATION);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const selectedTaskName = useMemo(() => {
    const task = todos.find(t => t.id === selectedTaskId);
    return task ? task.task : 'No task selected';
  }, [selectedTaskId, todos]);
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-primary">
          <Clock className="w-6 h-6" />
          Pomodoro Timer
        </CardTitle>
        <CardDescription>Link a task and start a focus session.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="text-8xl font-mono font-bold text-center w-full bg-card-foreground/5 p-4 rounded-lg">
          {formatTime(timeLeft)}
        </div>

        <div className="w-full space-y-2">
            <Label htmlFor="task-select">Link to Task</Label>
            <Select
                value={selectedTaskId ?? ''}
                onValueChange={setSelectedTaskId}
                disabled={isActive}
            >
                <SelectTrigger id="task-select">
                    <SelectValue placeholder="Select a task to focus on..." />
                </SelectTrigger>
                <SelectContent>
                    {incompleteTodos.length > 0 ? (
                        incompleteTodos.map(todo => (
                            <SelectItem key={todo.id} value={todo.id}>
                                {todo.task}
                            </SelectItem>
                        ))
                    ) : (
                        <div className="p-4 text-sm text-muted-foreground">No incomplete tasks.</div>
                    )}
                </SelectContent>
            </Select>
        </div>

        <div className="flex w-full justify-center items-center gap-4">
          <Button onClick={toggleTimer} size="lg" className="flex-grow">
            {isActive ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="lg">
            <RotateCcw className="w-5 h-5" />
            <span className="sr-only">Reset</span>
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
            <p>
                Focusing on: <span className="font-semibold text-primary">{selectedTaskName}</span>
            </p>
            <p>
                Today's completed sessions: {pomodoros}
            </p>
        </div>

      </CardContent>
    </Card>
  );
}
