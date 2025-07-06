"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ListChecks, Trash2, PlusCircle, CalendarIcon, AlertTriangle, Info, CheckCircle, Pencil, Timer } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { TodoItem } from '@/types';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

export function TodoList() {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('sevenk-todos', []);
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | undefined>(undefined);
  const [newDueDate, setNewDueDate] = useState<Date | undefined>(undefined);

  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState('');

  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      task: newTask.trim(),
      completed: false,
      priority: newPriority,
      dueDate: newDueDate ? newDueDate.toISOString() : undefined,
      pomodorosCompleted: 0,
    };
    setTodos(prevTodos => [newTodo, ...prevTodos]); // Add to top for visibility
    setNewTask('');
    setNewPriority(undefined);
    setNewDueDate(undefined);
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

  const handleEditClick = (todo: TodoItem) => {
    setEditingTodoId(todo.id);
    setEditingTaskText(todo.task);
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditingTaskText('');
  };

  const handleSaveEdit = () => {
    if (!editingTodoId || editingTaskText.trim() === '') {
        handleCancelEdit();
        return;
    };
    setTodos(prevTodos =>
        prevTodos.map(todo =>
            todo.id === editingTodoId ? { ...todo, task: editingTaskText.trim() } : todo
        )
    );
    handleCancelEdit();
  };

  const getPriorityIcon = (priority?: 'low' | 'medium' | 'high') => {
    if (priority === 'high') return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (priority === 'medium') return <Info className="w-4 h-4 text-yellow-500" />;
    if (priority === 'low') return <CheckCircle className="w-4 h-4 text-green-500" />;
    return null;
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
        <div className="space-y-3 mb-4">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            aria-label="New task input"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={newPriority} onValueChange={(val) => setNewPriority(val as 'low' | 'medium' | 'high' | undefined)}>
              <SelectTrigger className="w-full sm:w-[150px]" aria-label="Set task priority">
                <SelectValue placeholder="Set Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full sm:w-auto justify-start text-left font-normal",
                    !newDueDate && "text-muted-foreground"
                  )}
                  aria-label="Set task due date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newDueDate ? format(newDueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newDueDate}
                  onSelect={setNewDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
           <Button onClick={handleAddTask} aria-label="Add task" className="w-full">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Task
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
                  {editingTodoId === todo.id ? (
                     <div className="flex items-center gap-2 w-full">
                        <Input
                            value={editingTaskText}
                            onChange={(e) => setEditingTaskText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') handleCancelEdit();
                            }}
                            autoFocus
                            className="h-9"
                        />
                        <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 flex-grow min-w-0">
                        <Checkbox
                          id={`todo-${todo.id}`}
                          checked={todo.completed}
                          onCheckedChange={() => handleToggleTodo(todo.id)}
                          aria-labelledby={`todo-label-${todo.id}`}
                        />
                        <div className="flex-grow min-w-0">
                          <label
                            htmlFor={`todo-${todo.id}`}
                            id={`todo-label-${todo.id}`}
                            className={`cursor-pointer break-words ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                          >
                            {todo.task}
                          </label>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            {getPriorityIcon(todo.priority)}
                            {todo.priority && <span className="capitalize">{todo.priority}</span>}
                            {todo.dueDate && <span>{format(parseISO(todo.dueDate), "MMM d")}</span>}
                            {(todo.pomodorosCompleted ?? 0) > 0 && (
                                <span className="flex items-center gap-1 font-mono">
                                    <Timer className="w-3 h-3" />
                                    {todo.pomodorosCompleted}
                                </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(todo)}
                            aria-label={`Edit task: ${todo.task}`}
                          >
                            <Pencil className="w-4 h-4 text-muted-foreground hover:text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveTodo(todo.id)}
                            aria-label={`Remove task: ${todo.task}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive/80 hover:text-destructive" />
                          </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
