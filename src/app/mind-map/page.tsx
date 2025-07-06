import { MindMapCanvas } from '@/components/mind-map/mind-map-canvas';

export default function MindMapPage() {
  return (
    <div className="w-full h-[calc(100vh-120px)] flex flex-col">
      <header className="mb-4">
        <h1 className="text-3xl font-bold">Mind Map</h1>
        <p className="text-muted-foreground">
          Organize your thoughts, plan projects, and connect ideas visually. Add nodes and drag to connect them.
        </p>
      </header>
      <MindMapCanvas />
    </div>
  );
}
