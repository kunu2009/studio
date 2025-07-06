'use server';
/**
 * @fileOverview Generates daily micro-challenges for users.
 *
 * - generateMicroChallenges - A function that generates a list of challenges.
 * - GenerateMicroChallengesInput - The input type for the function.
 * - GenerateMicroChallengesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMicroChallengesInputSchema = z.object({
  count: z.number().default(3).describe('The number of challenges to generate.'),
});
export type GenerateMicroChallengesInput = z.infer<typeof GenerateMicroChallengesInputSchema>;

const GenerateMicroChallengesOutputSchema = z.object({
  challenges: z.array(z.string().describe('A short, actionable micro-challenge under 10 words.')),
});
export type GenerateMicroChallengesOutput = z.infer<typeof GenerateMicroChallengesOutputSchema>;

export async function generateMicroChallenges(input: GenerateMicroChallengesInput): Promise<GenerateMicroChallengesOutput> {
  return generateMicroChallengesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMicroChallengesPrompt',
  input: {schema: GenerateMicroChallengesInputSchema},
  output: {schema: GenerateMicroChallengesOutputSchema},
  prompt: `You are a creative AI that inspires users with unique and varied micro-challenges. Generate {{{count}}} different challenges that are not from the list of examples below.

The challenges must be simple, actionable, take less than 5 minutes, and cover a diverse mix of mental, physical, and creative activities. Be creative and surprising.

Do NOT use any of these examples in your response: 
- "Do 10 jumping jacks"
- "Write down one new idea"
- "Tidy one surface near you"
- "Drink a glass of water"
- "Name 5 state capitals"
- "Stretch your arms and legs"
`,
});

const fallbackChallenges = [
    'Do 10 jumping jacks',
    'Write down one new idea',
    'Tidy one surface near you',
    'Drink a glass of water',
    'Name 5 state capitals',
    'Take 5 deep breaths.',
    'Stretch for 60 seconds.',
    'Write down one thing you are grateful for.',
    'Listen to one new song.',
    'Walk around for 2 minutes.',
    'Think of a good memory.',
    'Plan one healthy meal.',
    'Unfollow one social media account that doesn\'t bring you joy.',
    'Compliment someone.',
    'Watch a short, educational video.',
  ];
  
function getRandomChallenges(count: number): string[] {
    const shuffled = fallbackChallenges.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

const generateMicroChallengesFlow = ai.defineFlow(
  {
    name: 'generateMicroChallengesFlow',
    inputSchema: GenerateMicroChallengesInputSchema,
    outputSchema: GenerateMicroChallengesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output?.challenges || output.challenges.length === 0) {
      // Fallback in case the model fails to return challenges
      return {
        challenges: getRandomChallenges(input.count),
      };
    }
    return output;
  }
);
