// src/app/study/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpenCheck } from 'lucide-react';

export default function StudyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="items-center">
          <BookOpenCheck className="w-16 h-16 text-primary mb-4" />
          <CardTitle className="text-3xl">Study Mode</CardTitle>
          <CardDescription className="text-lg text-center">
            Your dedicated zone for CLAT / MHCET preparation.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            This section is under active development. Soon you'll find flashcards, quizzes, study materials, and AI-powered learning tools here!
          </p>
          <img data-ai-hint="study books" src="https://picsum.photos/seed/studymode/400/250" alt="Study illustration" className="mt-6 rounded-lg shadow-md mx-auto" />
        </CardContent>
      </Card>
    </div>
  );
}
