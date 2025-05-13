// src/ai/flows/explain-topic-flow.ts
'use server';
/**
 * @fileOverview Explains a given topic using an AI model.
 *
 * - explainTopic - A function that provides an explanation for a topic.
 * - ExplainTopicInput - The input type for the explainTopic function.
 * - ExplainTopicOutput - The return type for the explainTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainTopicInputSchema = z.object({
  topic: z.string().describe('The topic or question to be explained.'),
});
export type ExplainTopicInput = z.infer<typeof ExplainTopicInputSchema>;

const ExplainTopicOutputSchema = z.object({
  explanation: z.string().describe('A concise explanation of the topic.'),
});
export type ExplainTopicOutput = z.infer<typeof ExplainTopicOutputSchema>;

export async function explainTopic(input: ExplainTopicInput): Promise<ExplainTopicOutput> {
  return explainTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTopicPrompt',
  input: {schema: ExplainTopicInputSchema},
  output: {schema: ExplainTopicOutputSchema},
  prompt: `Explain the following topic or question clearly and concisely, as if explaining to a student preparing for an exam. Keep the explanation focused and easy to understand.

Topic/Question: {{{topic}}}

Provide the explanation below:`,
  // Example safety settings if needed, otherwise defaults from genkit.ts are used
  // config: {
  //   safetySettings: [
  //     {
  //       category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
  //       threshold: 'BLOCK_ONLY_HIGH',
  //     },
  //   ],
  // },
});

const explainTopicFlow = ai.defineFlow(
  {
    name: 'explainTopicFlow',
    inputSchema: ExplainTopicInputSchema,
    outputSchema: ExplainTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        // This case should ideally not happen if the prompt is well-defined and the model behaves.
        // However, it's good practice to handle it.
        // You might want to throw an error or return a default message.
        console.error('ExplainTopicFlow: AI model did not return an output.');
        return { explanation: "Sorry, I couldn't generate an explanation for this topic at the moment." };
      }
    return output;
  }
);
