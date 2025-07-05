import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpenCheck, BrainCircuit } from 'lucide-react';
import { QuizGenerator } from '@/components/study/quiz-generator';

export default function StudyPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Tabs defaultValue="study" className="w-full max-w-2xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="study">
            <BookOpenCheck className="w-4 h-4 mr-2" />
            Study Materials
          </TabsTrigger>
          <TabsTrigger value="quiz">
            <BrainCircuit className="w-4 h-4 mr-2" />
            Practice Quiz
          </TabsTrigger>
        </TabsList>
        <TabsContent value="study">
          <Card className="shadow-xl">
            <CardHeader className="items-center">
              <BookOpenCheck className="w-16 h-16 text-primary mb-4" />
              <CardTitle className="text-3xl">Study Mode</CardTitle>
              <CardDescription className="text-lg text-center">
                Your dedicated zone for CLAT / MHCET preparation.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                This section is under active development. Soon you'll find flashcards, study materials, and more AI-powered learning tools here! Use the AI Assistant to explain topics for now.
              </p>
              <img data-ai-hint="study books" src="https://picsum.photos/seed/studymode/400/250" alt="Study illustration" className="mt-6 rounded-lg shadow-md mx-auto" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quiz">
            <QuizGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
