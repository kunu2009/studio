'use server';
/**
 * @fileOverview Generates a weekly summary based on user's activity.
 *
 * - generateWeeklySummary - A function that generates the summary.
 * - GenerateWeeklySummaryInput - The input type.
 * - GenerateWeeklySummaryOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWeeklySummaryInputSchema = z.object({
  challengeData: z.string().describe("A summary of micro-challenge completion for the past 7 days, including streaks and points."),
  todoData: z.string().describe("A summary of task completion for the past 7 days."),
  journalData: z.string().describe("A summary of moods recorded in the journal for the past 7 days."),
});
export type GenerateWeeklySummaryInput = z.infer<typeof GenerateWeeklySummaryInputSchema>;

const GenerateWeeklySummaryOutputSchema = z.object({
  summary: z.string().describe("A concise, encouraging summary of the user's weekly trend. Mention specific numbers and provide a positive outlook."),
});
export type GenerateWeeklySummaryOutput = z.infer<typeof GenerateWeeklySummaryOutputSchema>;

export async function generateWeeklySummary(input: GenerateWeeklySummaryInput): Promise<GenerateWeeklySummaryOutput> {
  return generateWeeklySummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWeeklySummaryPrompt',
  input: {schema: GenerateWeeklySummaryInputSchema},
  output: {schema: GenerateWeeklySummaryOutputSchema},
  prompt: `You are a friendly and encouraging AI productivity coach. Your goal is to provide a short, insightful summary of the user's week to motivate them.

Analyze the following data from the user's last 7 days:
- Micro-Challenges: {{{challengeData}}}
- To-Do List: {{{todoData}}}
- Journal Moods: {{{journalData}}}

Based on this, generate a summary. It should be 2-3 sentences long. For example: "Your week trend is improving. You’re maintaining a great streak in your challenges and completed most of your important tasks. Keep up the great work!"

Provide the summary below:`,
});

const generateWeeklySummaryFlow = ai.defineFlow(
  {
    name: 'generateWeeklySummaryFlow',
    inputSchema: GenerateWeeklySummaryInputSchema,
    outputSchema: GenerateWeeklySummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
