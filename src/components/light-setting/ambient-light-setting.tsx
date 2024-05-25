import { AmbientLight } from '@/objects/light/ambient-light.ts';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Color } from '@/objects/base/color.ts';
import { useApp } from '@/components/context.ts';
import { Eye, EyeOff, Lamp } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';

export interface AmbientLightSettingProps {
  light: AmbientLight;
  activeNode: string | null;
  setActiveNode: (val: string | null) => void;
}

export function AmbientLightSetting({
  light,
  activeNode,
  setActiveNode
}: AmbientLightSettingProps) {
  const appContext = useApp();
  const [isVisible, setIsVisible] = useState<boolean>(light.visible);

  const [nodeName, setNodeName] = useState<string>(light.name);
  const [debouncedNode] = useDebounce(nodeName, 200);

  const [color, setColor] = useState<string>(
    `#${light.color.toHex().toString(16)}`
  );
  const [intensity, setIntensity] = useState<string>(`${light.intensity}`);

  const [debouncedColor] = useDebounce(color, 200);
  const [debouncedIntensity] = useDebounce(intensity, 200);

  const initialColor = useRef<number | null>(light.color.toHex());
  const initialIntensity = useRef<number | null>(light.intensity);

  useEffect(() => {
    light.name = debouncedNode;
  }, [light, debouncedNode]);

  useEffect(() => {
    const colorHex = parseInt(`0x${debouncedColor.substring(1)}`, 16);

    if (isNaN(colorHex)) {
      return;
    }
    if (initialColor.current && colorHex === initialColor.current) {
      return;
    }

    light.color = Color.fromHex(colorHex);
    appContext.renderer.current?.render();
  }, [appContext.renderer, light, debouncedColor]);

  useEffect(() => {
    const intensity = +debouncedIntensity;

    if (isNaN(intensity)) {
      return;
    }
    if (initialIntensity.current && intensity === initialIntensity.current) {
      return;
    }

    light.intensity = intensity;
    appContext.renderer.current?.render();
  }, [appContext.renderer, light, debouncedIntensity]);

  return (
    <div className={'flex flex-col gap-y-1'}>
      <div
        className={`w-full flex justify-between p-1 cursor-pointer select-none border border-black  ${activeNode === light.nodeId ? 'bg-yellow-200 hover:bg-yellow-400' : 'hover:bg-gray-300'}`}
        onClick={() => {
          if (activeNode === light.nodeId) {
            setActiveNode(null);
          } else {
            setActiveNode(light.nodeId);
          }
        }}
      >
        <div className={'flex flex-row items-center gap-x-2'}>
          <Lamp className={'w-4 h-4'} />
          <h4>{nodeName}</h4>
        </div>
        <Button
          variant={'ghost'}
          size={'xs'}
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible((prev) => !prev);
            light.visible = !light.visible;
            appContext.renderer.current?.render();
          }}
        >
          {isVisible ? <Eye /> : <EyeOff />}
        </Button>
      </div>
      <div className={`${activeNode !== light.nodeId && 'hidden'}`}>
        <div className={'flex flex-col'}>
          <div className={'flex items-center gap-x-2'}>
            <p className={'font-medium text-sm'}>Name</p>
            <input
              className={'w-full'}
              type={'text'}
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
            />
          </div>
        </div>
        <div className={'flex flex-col'}>
          <div className={'flex items-center gap-x-2'}>
            <p>color</p>
            <input
              className={'w-12'}
              type={'color'}
              value={color}
              onChange={(e) => {
                const val = e.target.value;
                setColor(val);
                initialColor.current = null;
              }}
            />
            <p>intensity</p>
            <input
              className={'w-12'}
              type={'number'}
              min={0}
              value={intensity}
              onChange={(e) => {
                const val = e.target.value;
                setIntensity(val);
                initialIntensity.current = null;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
