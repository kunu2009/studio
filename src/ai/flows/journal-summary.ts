'use server';

/**
 * @fileOverview Summarizes journal entries using AI to identify recurring themes.
 *
 * - summarizeJournal - A function that handles the journal summarization process.
 * - SummarizeJournalInput - The input type for the summarizeJournal function.
 * - SummarizeJournalOutput - The return type for the summarizeJournal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeJournalInputSchema = z.object({
  journalEntries: z
    .string()
    .describe('A string containing all journal entries, separated by newlines.'),
});
export type SummarizeJournalInput = z.infer<typeof SummarizeJournalInputSchema>;

const SummarizeJournalOutputSchema = z.object({
  summary: z.string().describe('A summary of the journal entries.'),
});
export type SummarizeJournalOutput = z.infer<typeof SummarizeJournalOutputSchema>;

export async function summarizeJournal(input: SummarizeJournalInput): Promise<SummarizeJournalOutput> {
  return summarizeJournalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeJournalPrompt',
  input: {schema: SummarizeJournalInputSchema},
  output: {schema: SummarizeJournalOutputSchema},
  prompt: `You are an AI assistant designed to summarize journal entries and identify recurring themes.

  Here are the journal entries: {{{journalEntries}}}

  Please provide a concise summary of the entries, highlighting any recurring themes or patterns.`,
});

const summarizeJournalFlow = ai.defineFlow(
  {
    name: 'summarizeJournalFlow',
    inputSchema: SummarizeJournalInputSchema,
    outputSchema: SummarizeJournalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
