import { Scene } from '@/objects/scene.ts';
import { Light } from '@/objects/base/light.ts';
import { AmbientLight } from '@/objects/light/ambient-light.ts';
import { AmbientLightSetting } from '@/components/light-setting/ambient-light-setting.tsx';
import { DirectionalLight } from '@/objects/light/directional-light.ts';
import { DirectionalLightSetting } from '@/components/light-setting/directional-light-setting.tsx';
import { PointLight } from '@/objects/light/point-light.ts';
import { PointLightSetting } from '@/components/light-setting/point-light-setting.tsx';

export interface LightSettingsProps {
  scene: Scene;
  activeNode: string | null;
  setActiveNode: (val: string | null) => void;
}

export function LightSettings({
  scene,
  activeNode,
  setActiveNode
}: LightSettingsProps) {
  const lights = scene.children.filter((c) => c instanceof Light) as Light[];
  return (
    <>
      {lights.map((light) => {
        if (light instanceof AmbientLight) {
          return (
            <AmbientLightSetting
              key={light.nodeId}
              light={light}
              activeNode={activeNode}
              setActiveNode={setActiveNode}
            />
          );
        } else if (light instanceof DirectionalLight) {
          return (
            <DirectionalLightSetting
              key={light.nodeId}
              light={light}
              activeNode={activeNode}
              setActiveNode={setActiveNode}
            />
          );
        } else if (light instanceof PointLight) {
          return (
            <PointLightSetting
              key={light.nodeId}
              light={light}
              activeNode={activeNode}
              setActiveNode={setActiveNode}
            />
          );
        }

        return <></>;
      })}
    </>
  );
}
