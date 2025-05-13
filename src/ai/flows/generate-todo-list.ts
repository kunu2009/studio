// src/ai/flows/generate-todo-list.ts
'use server';
/**
 * @fileOverview Generates a todo list based on a user-provided prompt.
 *
 * - generateTodoList - A function that generates a todo list.
 * - GenerateTodoListInput - The input type for the generateTodoList function.
 * - GenerateTodoListOutput - The return type for the generateTodoList function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTodoListInputSchema = z.object({
  prompt: z.string().describe('A prompt to generate a todo list from.'),
});
export type GenerateTodoListInput = z.infer<typeof GenerateTodoListInputSchema>;

const GenerateTodoListOutputSchema = z.object({
  todoList: z.array(z.string()).describe('A list of todo items.'),
});
export type GenerateTodoListOutput = z.infer<typeof GenerateTodoListOutputSchema>;

export async function generateTodoList(input: GenerateTodoListInput): Promise<GenerateTodoListOutput> {
  return generateTodoListFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTodoListPrompt',
  input: {schema: GenerateTodoListInputSchema},
  output: {schema: GenerateTodoListOutputSchema},
  prompt: `Generate a todo list based on the following prompt:\n\nPrompt: {{{prompt}}}`,
});

const generateTodoListFlow = ai.defineFlow(
  {
    name: 'generateTodoListFlow',
    inputSchema: GenerateTodoListInputSchema,
    outputSchema: GenerateTodoListOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
