import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpenCheck, BrainCircuit, Layers } from 'lucide-react';
import { QuizGenerator } from '@/components/study/quiz-generator';
import { Flashcards } from '@/components/study/flashcards';

export default function StudyPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start">
       <div className="w-full max-w-4xl">
        <header className="mb-6 text-center">
            <h1 className="text-4xl font-bold">Study Hub</h1>
            <p className="text-muted-foreground">Your dedicated zone for CLAT / MHCET preparation.</p>
        </header>
        <Tabs defaultValue="quiz" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="study">
                <BookOpenCheck className="w-4 h-4 mr-2" />
                Study Materials
            </TabsTrigger>
            <TabsTrigger value="quiz">
                <BrainCircuit className="w-4 h-4 mr-2" />
                Practice Quiz
            </TabsTrigger>
            <TabsTrigger value="flashcards">
                <Layers className="w-4 h-4 mr-2" />
                Flashcards
            </TabsTrigger>
            </TabsList>
            <TabsContent value="study">
            <Card className="shadow-xl">
                <CardHeader className="items-center">
                <BookOpenCheck className="w-16 h-16 text-primary mb-4" />
                <CardTitle className="text-3xl">Study Materials</CardTitle>
                <CardDescription className="text-lg text-center">
                    This section is under active development.
                </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                <p className="text-muted-foreground">
                    Soon you'll find study notes, topic summaries, and more AI-powered learning tools here! Use the AI Assistant to explain topics for now.
                </p>
                <img data-ai-hint="study books" src="https://placehold.co/400x250.png" alt="Study illustration" className="mt-6 rounded-lg shadow-md mx-auto" />
                </CardContent>
            </Card>
            </TabsContent>
            <TabsContent value="quiz">
                <QuizGenerator />
            </TabsContent>
            <TabsContent value="flashcards">
                <Flashcards />
            </TabsContent>
        </Tabs>
       </div>
    </div>
  );
}
