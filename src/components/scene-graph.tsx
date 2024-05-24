import { NodeGraph } from '@/components/node-graph.tsx';
import { useCallback, useEffect, useState } from 'react';
import { useApp } from '@/components/context.ts';
import { Mesh } from '@/objects/mesh.ts';
import { LightSettings } from '@/components/light-setting/light-settings.tsx';

export const SceneGraph = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const appContext = useApp();

  const cb = useCallback(() => {
    setShouldRender(!shouldRender);
  }, [shouldRender]);

  useEffect(() => {
    const renderer = appContext.renderer.current;

    if (renderer !== null) {
      renderer.onSceneChanged.add(cb);
    }

    return () => {
      appContext.renderer.current?.onSceneChanged.delete(cb);
    };
  }, [appContext.renderer, cb]);

  if (
    appContext.renderer.current === null ||
    appContext.renderer.current?.model === null
  ) {
    return <></>;
  }

  const scene = appContext.renderer.current!.model!.scene;

  return (
    <div className={'flex-grow flex flex-col'}>
      <h3 className={'text-md font-bold'}>{scene.name} Graph</h3>
      <div className={'flex flex-col gap-y-1 flex-grow overflow-y-auto'}>
        {scene.children
          .filter((child) => child instanceof Mesh)
          .map((node) => {
            return (
              <NodeGraph
                key={node.nodeId}
                data={{ node }}
                activeNode={activeNode}
                setActiveNode={setActiveNode}
              />
            );
          })}
        <LightSettings
          scene={scene}
          activeNode={activeNode}
          setActiveNode={setActiveNode}
        />
      </div>
    </div>
  );
};
