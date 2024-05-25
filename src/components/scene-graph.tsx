import { NodeGraph } from '@/components/node-graph.tsx';
import { useCallback, useEffect, useState } from 'react';
import { useApp } from '@/components/context.ts';
import { Mesh } from '@/objects/mesh.ts';
import { LightSettings } from '@/components/light-setting/light-settings.tsx';
import { ComponentCreator } from '@/components/component-creator.tsx';
import { MeshImporter } from '@/components/mesh-importer.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';

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
    <div className={'flex-grow flex flex-col overflow-y-auto'}>
      <div className={'flex flex-row justify-between'}>
        <h3 className={'text-md font-bold'}>{scene.name} Graph</h3>
        <div className={'flex flex-row gap-x-2'}>
          <ComponentCreator node={scene} triggerRender={cb} withLight={true} />
          <MeshImporter node={scene} triggerRender={cb} />
        </div>
      </div>
      <ScrollArea className={'px-4'}>
        <div className={'flex flex-col gap-y-2'}>
          {scene.children
            .filter((child) => child instanceof Mesh)
            .map((node) => {
              return (
                <NodeGraph
                  key={node.nodeId}
                  data={{ node }}
                  activeNode={activeNode}
                  setActiveNode={setActiveNode}
                  triggerRender={cb}
                />
              );
            })}
          <LightSettings
            scene={scene}
            activeNode={activeNode}
            setActiveNode={setActiveNode}
            triggerRender={cb}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
