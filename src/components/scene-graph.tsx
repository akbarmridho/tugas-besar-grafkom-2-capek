import { NodeGraph, NodeGraphData } from '@/components/node-graph.tsx';
import { useState } from 'react';

const nodes: NodeGraphData[] = [
  {
    id: 'head',
    name: 'head',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    children: []
  },
  {
    id: 'body',
    name: 'body',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    children: [
      {
        id: 'left-arm',
        name: 'left-arm',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        children: []
      },
      {
        id: 'right-arm',
        name: 'right-arm',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        children: []
      }
    ]
  }
];

export const SceneGraph = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className={'flex-grow flex flex-col'}>
      <h3 className={'text-md font-bold'}>Scene Graph</h3>
      <div className={'flex flex-col gap-y-1 flex-grow overflow-y-auto'}>
        {nodes.map((node) => (
          <NodeGraph
            data={node}
            key={node.id}
            activeNode={activeNode}
            setActiveNode={setActiveNode}
          />
        ))}
      </div>
    </div>
  );
};
