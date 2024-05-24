import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Color } from '@/objects/base/color.ts';
import { useApp } from '@/components/context.ts';
import { XYZ } from '@/components/node-graph.tsx';
import { Eclipse, Sun } from 'lucide-react';
import { PointLight } from '@/objects/light/point-light.ts';

export interface PointLightSettingProps {
  light: PointLight;
  activeNode: string | null;
  setActiveNode: (val: string | null) => void;
}

interface PointLightConfig {
  constant: string;
  linear: string;
  quadratic: string;
}

export function PointLightSetting({
  light,
  activeNode,
  setActiveNode
}: PointLightSettingProps) {
  const appContext = useApp();

  const [nodeName, setNodeName] = useState<string>(light.name);
  const [debouncedNode] = useDebounce(nodeName, 200);

  const [position, setPosition] = useState<XYZ>({
    x: String(light.position.x),
    y: String(light.position.y),
    z: String(light.position.z)
  });
  const [color, setColor] = useState<string>(
    `#${light.color.toHex().toString(16)}`
  );
  const [intensity, setIntensity] = useState<string>(`${light.intensity}`);
  const [config, setConfig] = useState<PointLightConfig>({
    constant: light.constant.toString(),
    linear: light.constant.toString(),
    quadratic: light.quadratic.toString()
  });

  const [debouncedPosition] = useDebounce(position, 200);
  const [debouncedColor] = useDebounce(color, 200);
  const [debouncedIntensity] = useDebounce(intensity, 200);
  const [debouncedConfig] = useDebounce(config, 200);

  const initialPosition = useRef<XYZ | null>({ ...position });
  const initialColor = useRef<number | null>(light.color.toHex());
  const initialIntensity = useRef<number | null>(light.intensity);
  const initialConfig = useRef<PointLightConfig | null>({ ...config });

  useEffect(() => {
    light.name = debouncedNode;
  }, [light, debouncedNode]);

  useEffect(() => {
    const x = +debouncedPosition.x;
    const y = +debouncedPosition.y;
    const z = +debouncedPosition.z;

    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      return;
    }
    if (
      initialPosition.current &&
      x === +initialPosition.current.x &&
      y === +initialPosition.current.y &&
      z === +initialPosition.current.z
    ) {
      return;
    }

    light.setPosition(new Vector3(x, y, z));
    appContext.renderer.current?.render();
  }, [appContext.renderer, light, debouncedPosition]);

  useEffect(() => {
    const c = +debouncedConfig.constant;
    const l = +debouncedConfig.linear;
    const q = +debouncedConfig.quadratic;

    if (isNaN(c) || isNaN(l) || isNaN(q)) {
      return;
    }
    if (
      initialConfig.current &&
      c === +initialConfig.current.constant &&
      l === +initialConfig.current.linear &&
      q === +initialConfig.current.quadratic
    ) {
      return;
    }

    light.constant = c;
    light.quadratic = q;
    light.linear = l;
    appContext.renderer.current?.render();
  }, [appContext.renderer, light, debouncedConfig]);

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
        className={`w-full p-1 cursor-pointer select-none border border-black  ${activeNode === light.nodeId ? 'bg-yellow-200 hover:bg-yellow-400' : 'hover:bg-gray-300'}`}
        onClick={() => {
          if (activeNode === light.nodeId) {
            setActiveNode(null);
          } else {
            setActiveNode(light.nodeId);
          }
        }}
      >
        <div className={'flex flex-row items-center gap-x-2'}>
          <Eclipse className={'w-4 h-4'} />
          {`${nodeName}`}
        </div>
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
        <div className={'flex flex-col'}>
          <h4 className={'font-medium text-sm'}>Position</h4>
          <div className={'flex items-center gap-x-2'}>
            <p>x</p>
            <input
              className={'w-12'}
              type={'number'}
              value={position.x}
              onChange={(e) => {
                const val = e.target.value;
                setPosition((prev) => ({ ...prev, x: val }));
                initialPosition.current = null;
              }}
            />
            <p>y</p>
            <input
              className={'w-12'}
              type={'number'}
              value={position.y}
              onChange={(e) => {
                const val = e.target.value;
                setPosition((prev) => ({ ...prev, y: val }));
                initialPosition.current = null;
              }}
            />
            <p>z</p>
            <input
              className={'w-12'}
              type={'number'}
              value={position.z}
              onChange={(e) => {
                const val = e.target.value;
                setPosition((prev) => ({ ...prev, z: val }));
                initialPosition.current = null;
              }}
            />
          </div>
        </div>
        <div className={'flex flex-col gap-y-2 mt-2'}>
          <div className={'flex items-center gap-x-2'}>
            <p>constant</p>
            <input
              className={'w-12'}
              type={'number'}
              value={config.constant}
              onChange={(e) => {
                const val = e.target.value;
                setConfig((prev) => ({ ...prev, constant: val }));
                initialConfig.current = null;
              }}
            />
          </div>
          <div className={'flex items-center gap-x-2'}>
            <p>linear</p>
            <input
              className={'w-12'}
              type={'number'}
              value={config.linear}
              onChange={(e) => {
                const val = e.target.value;
                setConfig((prev) => ({ ...prev, linear: val }));
                initialConfig.current = null;
              }}
            />
          </div>
          <div className={'flex items-center gap-x-2'}>
            <p>quadratic</p>
            <input
              className={'w-12'}
              type={'number'}
              value={config.quadratic}
              onChange={(e) => {
                const val = e.target.value;
                setConfig((prev) => ({ ...prev, quadratic: val }));
                initialConfig.current = null;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
