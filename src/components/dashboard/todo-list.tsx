"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { FolderKanban, Trash2, PlusCircle, CalendarIcon, AlertTriangle, Info, CheckCircle, Pencil, Timer, Star } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { TodoItem, Project } from '@/types';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';


const PROJECT_COLORS = [
  'bg-sky-500', 'bg-green-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500', 'bg-pink-500'
];

export function TodoList() {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('sevenk-todos', []);
  const [projects, setProjects] = useLocalStorage<Project[]>('sevenk-projects', []);
  
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | undefined>(undefined);
  const [newDueDate, setNewDueDate] = useState<Date | undefined>(undefined);
  const [newProjectId, setNewProjectId] = useState<string | undefined>(undefined);
  const [isNextAction, setIsNextAction] = useState(false);

  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState('');
  
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState(PROJECT_COLORS[0]);
  const [filterProjectId, setFilterProjectId] = useState('all');

  const { toast } = useToast();

  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      task: newTask.trim(),
      completed: false,
      priority: newPriority,
      dueDate: newDueDate ? newDueDate.toISOString() : undefined,
      pomodorosCompleted: 0,
      projectId: newProjectId,
      isNextAction: isNextAction,
    };
    setTodos(prevTodos => [newTodo, ...prevTodos]);
    setNewTask('');
    setNewPriority(undefined);
    setNewDueDate(undefined);
    setNewProjectId(undefined);
    setIsNextAction(false);
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
  
  const handleAddProject = () => {
    if (newProjectName.trim() === '') {
      toast({ title: "Project name is empty", variant: "destructive" });
      return;
    }
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: newProjectName.trim(),
      color: newProjectColor,
    };
    setProjects(prev => [...prev, newProject]);
    setNewProjectName('');
    setNewProjectColor(PROJECT_COLORS[0]);
    toast({ title: `Project "${newProject.name}" created.` });
  };

  const filteredTodos = useMemo(() => {
    if (filterProjectId === 'all') return todos;
    if (filterProjectId === 'unassigned') return todos.filter(t => !t.projectId);
    return todos.filter(t => t.projectId === filterProjectId);
  }, [todos, filterProjectId]);

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
          <FolderKanban className="w-6 h-6" />
          Task Manager
        </CardTitle>
        <CardDescription>Organize your tasks with projects and priorities.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Task Form */}
        <div className="space-y-3 p-4 border rounded-lg bg-card-foreground/5">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            aria-label="New task input"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Select value={newPriority} onValueChange={(val) => setNewPriority(val as any)}>
              <SelectTrigger aria-label="Set task priority"><SelectValue placeholder="Set Priority" /></SelectTrigger>
              <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("justify-start text-left font-normal", !newDueDate && "text-muted-foreground")} aria-label="Set task due date">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newDueDate ? format(newDueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={newDueDate} onSelect={setNewDueDate} initialFocus /></PopoverContent>
            </Popover>

            <Select value={newProjectId} onValueChange={(val) => setNewProjectId(val === 'unassigned' ? undefined : val)}>
                <SelectTrigger aria-label="Assign to project"><SelectValue placeholder="Assign to Project" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
            </Select>
            <div className="flex items-center space-x-2 justify-center p-2 rounded-md border border-input">
                <Switch id="next-action" checked={isNextAction} onCheckedChange={setIsNextAction} />
                <Label htmlFor="next-action" className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400" /> Next Action</Label>
            </div>
          </div>
           <Button onClick={handleAddTask} aria-label="Add task" className="w-full">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Filters and Project Management */}
        <div className="flex justify-between items-center gap-2">
            <Select value={filterProjectId} onValueChange={setFilterProjectId}>
                <SelectTrigger className="w-full sm:w-[200px]" aria-label="Filter by project">
                    <SelectValue placeholder="Filter by Project" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
            </Select>

             <Popover>
              <PopoverTrigger asChild><Button variant="outline">New Project</Button></PopoverTrigger>
              <PopoverContent className="w-auto p-4 space-y-3">
                  <Label>Create a new project</Label>
                  <Input value={newProjectName} onChange={e => setNewProjectName(e.target.value)} placeholder="Project name" />
                  <div className="flex gap-2">
                    {PROJECT_COLORS.map(color => (
                        <button key={color} onClick={() => setNewProjectColor(color)} className={cn('w-6 h-6 rounded-full', color, newProjectColor === color && 'ring-2 ring-offset-2 ring-offset-background ring-primary')}></button>
                    ))}
                  </div>
                  <Button onClick={handleAddProject} className="w-full">Add Project</Button>
              </PopoverContent>
            </Popover>
        </div>

        {/* Task List */}
        <ScrollArea className="h-[250px] pr-3">
          {filteredTodos.length === 0 ? (
            <p className="text-center text-muted-foreground pt-10">No tasks here. Add some!</p>
          ) : (
            <ul className="space-y-2">
              {filteredTodos.map(todo => {
                const project = projects.find(p => p.id === todo.projectId);
                return (
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
                            className={`cursor-pointer break-words flex items-center gap-2 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                          >
                            {todo.isNextAction && <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                            {todo.task}
                          </label>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            {getPriorityIcon(todo.priority)}
                            {todo.priority && <span className="capitalize">{todo.priority}</span>}
                            {todo.dueDate && <span>{format(parseISO(todo.dueDate), "MMM d")}</span>}
                             {project && <Badge className={cn('text-white text-xs', project.color)}>{project.name}</Badge>}
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
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(todo)} aria-label={`Edit task: ${todo.task}`}>
                            <Pencil className="w-4 h-4 text-muted-foreground hover:text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveTodo(todo.id)} aria-label={`Remove task: ${todo.task}`}>
                            <Trash2 className="w-4 h-4 text-destructive/80 hover:text-destructive" />
                          </Button>
                      </div>
                    </>
                  )}
                </li>
              )})}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
