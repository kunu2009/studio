"use server";

import { generateTodoList, GenerateTodoListInput, GenerateTodoListOutput } from "@/ai/flows/generate-todo-list";
import { summarizeJournal, SummarizeJournalInput, SummarizeJournalOutput } from "@/ai/flows/journal-summary";

export async function handleGenerateTodoListAction(input: GenerateTodoListInput): Promise<GenerateTodoListOutput | { error: string }> {
  try {
    const result = await generateTodoList(input);
    return result;
  } catch (error) {
    console.error("Error generating todo list:", error);
    return { error: (error instanceof Error ? error.message : "An unknown error occurred") };
  }
}

export async function handleSummarizeJournalAction(input: SummarizeJournalInput): Promise<SummarizeJournalOutput | { error: string }> {
  try {
    const result = await summarizeJournal(input);
    return result;
  } catch (error) {
    console.error("Error summarizing journal:", error);
    return { error: (error instanceof Error ? error.message : "An unknown error occurred") };
  }
}
