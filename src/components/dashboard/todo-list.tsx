"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListChecks, Trash2, PlusCircle } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { TodoItem } from '@/types';

export function TodoList() {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('zenith-todos', []);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      task: newTask.trim(),
      completed: false,
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
    setNewTask('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleRemoveTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-primary">
          <ListChecks className="w-6 h-6" />
          To-Do List
        </CardTitle>
        <CardDescription>Organize your tasks and stay productive.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            aria-label="New task input"
          />
          <Button onClick={handleAddTask} aria-label="Add task">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
        <ScrollArea className="h-[200px] pr-3">
          {todos.length === 0 ? (
            <p className="text-center text-muted-foreground">No tasks yet. Add some!</p>
          ) : (
            <ul className="space-y-2">
              {todos.map(todo => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between p-3 bg-card-foreground/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`todo-${todo.id}`}
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleTodo(todo.id)}
                      aria-labelledby={`todo-label-${todo.id}`}
                    />
                    <label
                      htmlFor={`todo-${todo.id}`}
                      id={`todo-label-${todo.id}`}
                      className={`cursor-pointer ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {todo.task}
                    </label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveTodo(todo.id)}
                    aria-label={`Remove task: ${todo.task}`}
                  >
                    <Trash2 className="w-4 h-4 text-destructive/80 hover:text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
