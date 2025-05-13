import { config } from 'dotenv';
config();

import '@/ai/flows/journal-summary.ts';
import '@/ai/flows/generate-todo-list.ts';
import '@/ai/flows/explain-topic-flow.ts'; // Added new flow
