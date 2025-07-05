"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { handleGenerateQuizAction } from '@/app/actions';
import type { QuizQuestion } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      toast({ title: 'Topic is empty', description: 'Please enter a topic to generate a quiz.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    resetQuizState();
    const result = await handleGenerateQuizAction({ topic, count: 5 });
    setIsLoading(false);
    if ('error' in result) {
      toast({ title: 'AI Error', description: result.error, variant: 'destructive' });
    } else if (result.questions && result.questions.length > 0) {
      setQuizQuestions(result.questions);
      toast({ title: 'Quiz Generated!', description: `A quiz about ${topic} is ready.` });
    } else {
        toast({ title: 'No Questions', description: 'The AI could not generate questions for this topic.', variant: 'destructive' });
    }
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) {
        toast({ title: 'No answer selected', description: 'Please choose an option.', variant: 'destructive' });
        return;
    }
    setIsAnswered(true);
    if (selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };
  
  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(prev => prev + 1);
  };
  
  const resetQuizState = () => {
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
  };

  const startNewQuiz = () => {
    resetQuizState();
    setTopic('');
  }

  const renderQuizContent = () => {
    if (quizQuestions.length === 0) {
      return (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">Enter a topic and the AI will generate a short quiz to test your knowledge.</p>
          <div className="w-full max-w-sm space-y-2">
            <Input 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)} 
              placeholder="e.g., The French Revolution"
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateQuiz()}
            />
            <Button onClick={handleGenerateQuiz} disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
              {isLoading ? 'Generating...' : 'Generate Quiz'}
            </Button>
          </div>
        </div>
      );
    }

    if (currentQuestionIndex >= quizQuestions.length) {
      return (
        <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Quiz Complete!</h2>
            <p className="text-lg text-muted-foreground">You scored</p>
            <p className="text-5xl font-bold text-primary">{score} / {quizQuestions.length}</p>
            <Button onClick={startNewQuiz}>Create Another Quiz</Button>
        </div>
      );
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Progress value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
            </div>
            <h3 className="text-xl font-semibold">{currentQuestion.question}</h3>
            <RadioGroup value={selectedAnswer ?? ''} onValueChange={setSelectedAnswer} disabled={isAnswered}>
                {currentQuestion.options.map((option, index) => {
                    const isCorrect = option === currentQuestion.correctAnswer;
                    const isSelected = option === selectedAnswer;
                    let optionClass = "";
                    if (isAnswered) {
                        if (isCorrect) optionClass = "bg-green-500/20 border-green-500 text-green-300";
                        else if (isSelected) optionClass = "bg-red-500/20 border-red-500 text-red-400";
                    }
                    return (
                        <Label key={index} className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${optionClass}`}>
                            <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${index}`} />
                            <span>{option}</span>
                            {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 ml-auto text-green-400" />}
                            {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 ml-auto text-red-400" />}
                        </Label>
                    );
                })}
            </RadioGroup>
            <div className="flex justify-end">
                {isAnswered ? (
                    <Button onClick={handleNextQuestion}>Next Question</Button>
                ) : (
                    <Button onClick={handleAnswerSubmit}>Submit Answer</Button>
                )}
            </div>
        </div>
    );
  };


  return (
    <Card className="shadow-xl">
      <CardHeader className="items-center">
        <CardTitle className="text-3xl">AI-Powered Quiz</CardTitle>
        <CardDescription>Test your knowledge on any topic.</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px] flex items-center justify-center">
        {renderQuizContent()}
      </CardContent>
    </Card>
  );
}
