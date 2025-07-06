"use server";

import { generateTodoList, GenerateTodoListInput, GenerateTodoListOutput } from "@/ai/flows/generate-todo-list";
import { summarizeJournal, SummarizeJournalInput, SummarizeJournalOutput } from "@/ai/flows/journal-summary";
import { explainTopic, ExplainTopicInput, ExplainTopicOutput } from "@/ai/flows/explain-topic-flow";
import { generateQuiz, GenerateQuizInput, GenerateQuizOutput } from "@/ai/flows/generate-quiz-flow";
import { textToSpeech, TextToSpeechInput, TextToSpeechOutput } from "@/ai/flows/text-to-speech-flow";
import { generateWeeklySummary, GenerateWeeklySummaryInput, GenerateWeeklySummaryOutput } from "@/ai/flows/generate-weekly-summary";
import type { Quiz, QuizQuestion } from "@/types";

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

export async function handleExplainTopicAction(input: ExplainTopicInput): Promise<ExplainTopicOutput | { error: string }> {
  try {
    const result = await explainTopic(input);
    return result;
  } catch (error) {
    console.error("Error explaining topic:", error);
    return { error: (error instanceof Error ? error.message : "An unknown error occurred") };
  }
}

export async function handleGenerateQuizAction(input: GenerateQuizInput): Promise<GenerateQuizOutput | { error: string }> {
  try {
    const result = await generateQuiz(input);
    return result;
  } catch (error) {
    console.error("Error generating quiz:", error);
    return { error: (error instanceof Error ? error.message : "An unknown error occurred") };
  }
}

export async function handleTextToSpeechAction(input: TextToSpeechInput): Promise<TextToSpeechOutput | { error: string }> {
  try {
    const result = await textToSpeech(input);
    return result;
  } catch (error) {
    console.error("Error generating speech:", error);
    return { error: (error instanceof Error ? error.message : "An unknown error occurred") };
  }
}

export async function handleGenerateWeeklySummaryAction(input: GenerateWeeklySummaryInput): Promise<GenerateWeeklySummaryOutput | { error: string }> {
  try {
    const result = await generateWeeklySummary(input);
    return result;
  } catch (error) {
    console.error("Error generating weekly summary:", error);
    return { error: (error instanceof Error ? error.message : "An unknown error occurred") };
  }
}


export type { Quiz, QuizQuestion };
