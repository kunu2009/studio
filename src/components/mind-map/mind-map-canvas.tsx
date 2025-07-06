"use client";

import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  Background,
  MiniMap,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import useLocalStorage from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';

const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: 'Central Idea' }, position: { x: 250, y: 5 } },
];
const initialEdges: Edge[] = [];

const LOCAL_STORAGE_NODES_KEY = 'sevenk-mindmap-nodes';
const LOCAL_STORAGE_EDGES_KEY = 'sevenk-mindmap-edges';

export function MindMapCanvas() {
  const [nodes, setNodes] = useLocalStorage<Node[]>(LOCAL_STORAGE_NODES_KEY, initialNodes);
  const [edges, setEdges] = useLocalStorage<Edge[]>(LOCAL_STORAGE_EDGES_KEY, initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const handleAddNode = () => {
    const newNodeId = `node_${(nodes.length + 1)}_${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `New Idea` },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div className="flex-grow w-full h-full rounded-lg border bg-card relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="bg-background"
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      <div className="absolute top-4 left-4 z-10">
        <Button onClick={handleAddNode}>
          <BrainCircuit className="w-4 h-4 mr-2" />
          Add Node
        </Button>
      </div>
    </div>
  );
}
