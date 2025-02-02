import { Node } from '@/objects/base/node.ts';
import { Mesh } from '@/objects/mesh.ts';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { degreeToRadian, radianToDegree } from '@/utils/math/angle.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Euler } from '@/utils/math/euler.ts';
import { useApp } from '@/components/context.ts';
import { Button } from '@/components/ui/button.tsx';
import { Box, Eye, EyeOff, Sun, Trash } from 'lucide-react';
import { TextureOption, TextureOptions } from '@/factory/texture-selector.ts';
import { BasicMaterial } from '@/objects/material/basic-material.ts';
import { ShaderMaterial } from '@/objects/base/shader-material.ts';
import { PhongMaterial } from '@/objects/material/phong-material.ts';
import { Color } from '@/objects/base/color.ts';
import { Texture } from '@/objects/base/texture';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip.tsx';
import { useConfirm } from '@/components/alert-dialog.tsx';
import { ComponentCreator } from '@/components/component-creator.tsx';
import { MeshExporter } from '@/components/mesh-exporter.tsx';
import { MeshImporter } from '@/components/mesh-importer.tsx';

export interface NodeGraphData {
  node: Node;
}

interface NodeGraphProps {
  data: NodeGraphData;
  activeNode: string | null;
  setActiveNode: (id: string | null) => void;
  triggerRender: () => void;
}

export interface XYZ {
  x: string;
  y: string;
  z: string;
}

const findNameBySource = (src: string) => {
  const result = TextureOptions.find((t) => t.diffuse && t.diffuse === src);

  if (result) {
    return result.name;
  }

  return null;
};

const getTextureName = (
  material: ShaderMaterial | null
): string | null | Color => {
  if (material instanceof BasicMaterial) {
    const texture = material.texture;

    if (texture.isPlainColor) {
      return texture.defaultColor;
    }

    if (texture.textureSrc === null) return null;

    return findNameBySource(texture.textureSrc);
  } else if (material instanceof PhongMaterial) {
    const texture = material.diffuseMap;

    if (texture.isPlainColor) {
      return texture.defaultColor;
    }

    if (texture.textureSrc === null) return null;

    return findNameBySource(texture.textureSrc);
  }

  return null;
};

const updateMaterialTexture = (
  material: ShaderMaterial,
  value: TextureOption | Color,
  isSpecular?: boolean,
  setDefaultSpecular?: boolean
) => {
  if (material instanceof BasicMaterial) {
    if (value instanceof Color) {
      material.texture.setData(value);
    } else if (value.diffuse) {
      material.texture.setData(value.diffuse);
    }
  } else if (material instanceof PhongMaterial) {
    if (value instanceof Color) {
      if (isSpecular) {
        material.specularMap.setData(value);
      } else {
        material.diffuseMap.setData(value);

        if (setDefaultSpecular) {
          material.specularMap.setData(Color.fromHex(0xcfcfcf));
        }
      }

      material.normalMap = undefined;
      material.displacementMap = undefined;
    } else {
      material.diffuseMap.setData(value.diffuse);
      material.specularMap.setData(value.specular);
      material.normalMap = new Texture({ data: value.normal });
      material.displacementMap = new Texture({ data: value.displacement });
    }
  }
};

export const NodeGraph = ({
  data,
  activeNode,
  setActiveNode,
  triggerRender
}: NodeGraphProps) => {
  const appContext = useApp();
  const confirm = useConfirm();

  const filtered = data.node.children.filter((child) => child instanceof Mesh);
  const [nodeName, setNodeName] = useState<string>(data.node.name);
  const [isVisible, setIsVisible] = useState<boolean>(data.node.visible);
  const [position, setPosition] = useState<XYZ>({
    x: String(data.node.position.getComponent(0)),
    y: String(data.node.position.getComponent(1)),
    z: String(data.node.position.getComponent(2))
  });
  const [scale, setScale] = useState<XYZ>({
    x: String(data.node.scale.getComponent(0)),
    y: String(data.node.scale.getComponent(1)),
    z: String(data.node.scale.getComponent(2))
  });
  const [rotation, setRotation] = useState<XYZ>({
    x: String(radianToDegree(data.node.rotation.x)),
    y: String(radianToDegree(data.node.rotation.y)),
    z: String(radianToDegree(data.node.rotation.z))
  });

  const material = data.node instanceof Mesh ? data.node.material : null;

  const texname = getTextureName(material);

  const [texture, setTexture] = useState<string | null>(
    texname instanceof Color ? 'color' : texname
  );

  const [color, setColor] = useState<string>(
    texname instanceof Color ? `#${texname.toHex().toString(16)}` : '#ff0000'
  );
  const [specularColor, setSpecularColor] = useState<string>(`#cfcfcf`);

  const phongShininess =
    material instanceof PhongMaterial ? material.shininess : 0;
  const [shininess, setShininess] = useState<string>(String(phongShininess));

  const phongDisplacementScale =
    material instanceof PhongMaterial && material.uniforms.hasDisplacementMap
      ? material.displacementScale
      : 0.0;
  const [displacementScale, setDisplacementScale] = useState<string>(
    String(phongDisplacementScale)
  );

  const phongDisplacementBias =
    material instanceof PhongMaterial && material.uniforms.hasDisplacementMap
      ? material.displacementBias
      : 0.0;
  const [displacementBias, setDisplacementBias] = useState<string>(
    String(phongDisplacementBias)
  );

  const initialColor = useRef<string | null>(color);
  const initialSpecularColor = useRef<string | null>(specularColor);
  const initialPosition = useRef<XYZ | null>({ ...position });
  const initialRotation = useRef<XYZ | null>({ ...rotation });
  const initialScale = useRef<XYZ | null>({ ...scale });
  const initialShininess = useRef<string | null>(shininess);
  const initialDisplacementScale = useRef<string | null>(displacementScale);
  const initialDisplacementBias = useRef<string | null>(displacementBias);

  const [debouncedColor] = useDebounce(color, 200);
  const [debouncedSpecularColor] = useDebounce(specularColor, 200);
  const [debouncedNode] = useDebounce(nodeName, 200);
  const [debouncedPosition] = useDebounce(position, 200);
  const [debouncedRotation] = useDebounce(rotation, 200);
  const [debouncedScale] = useDebounce(scale, 200);
  const [debouncedShininess] = useDebounce(shininess, 200);
  const [debouncedDisplacementScale] = useDebounce(displacementScale, 200);
  const [debouncedDisplacementBias] = useDebounce(displacementBias, 200);

  useEffect(() => {
    data.node.name = debouncedNode;
  }, [data.node, debouncedNode]);

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

    data.node.setPosition(new Vector3(x, y, z));
    appContext.renderer.current?.render();
  }, [appContext.renderer, data.node, debouncedPosition]);

  useEffect(() => {
    const x = +debouncedScale.x;
    const y = +debouncedScale.y;
    const z = +debouncedScale.z;

    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      return;
    }

    if (
      initialScale.current &&
      x === +initialScale.current.x &&
      y === +initialScale.current.y &&
      z === +initialScale.current.z
    ) {
      return;
    }

    data.node.setScale(new Vector3(x, y, z));
    appContext.renderer.current?.render();
  }, [appContext.renderer, data.node, debouncedScale]);

  useEffect(() => {
    const x = +debouncedRotation.x;
    const y = +debouncedRotation.y;
    const z = +debouncedRotation.z;

    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      return;
    }

    if (
      initialRotation.current &&
      x === +initialRotation.current.x &&
      y === +initialRotation.current.y &&
      z === +initialRotation.current.z
    ) {
      return;
    }

    data.node.setFromEulerRotation(
      new Euler(degreeToRadian(x), degreeToRadian(y), degreeToRadian(z))
    );
    appContext.renderer.current?.render();
  }, [appContext.renderer, data.node, debouncedRotation]);

  useEffect(() => {
    const colorHex = parseInt(`0x${debouncedColor.substring(1)}`, 16);

    if (isNaN(colorHex)) {
      return;
    }
    if (
      initialColor.current &&
      colorHex === parseInt(`0x${initialColor.current.substring(1)}`, 16)
    ) {
      return;
    }

    if (material) {
      updateMaterialTexture(material, Color.fromHex(colorHex));
    }

    appContext.renderer.current?.render();
  }, [appContext.renderer, debouncedColor, material]);

  useEffect(() => {
    const colorHex = parseInt(`0x${debouncedSpecularColor.substring(1)}`, 16);

    if (isNaN(colorHex)) {
      return;
    }
    if (
      initialSpecularColor.current &&
      colorHex ===
        parseInt(`0x${initialSpecularColor.current.substring(1)}`, 16)
    ) {
      return;
    }

    if (material) {
      updateMaterialTexture(material, Color.fromHex(colorHex), true);
    }

    appContext.renderer.current?.render();
  }, [appContext.renderer, debouncedSpecularColor, material]);

  useEffect(() => {
    const shininess = +debouncedShininess;

    if (isNaN(shininess)) {
      return;
    }

    if (initialShininess.current) {
      return;
    }

    if (material) {
      (material as PhongMaterial).shininess = shininess;
    }

    appContext.renderer.current?.render();
  }, [appContext.renderer, debouncedShininess, material]);

  useEffect(() => {
    const displacementScale = +debouncedDisplacementScale;

    if (isNaN(displacementScale)) {
      return;
    }

    if (initialDisplacementScale.current) {
      return;
    }

    if (material) {
      (material as PhongMaterial).displacementScale = displacementScale;
    }

    appContext.renderer.current?.render();
  }, [appContext.renderer, debouncedDisplacementScale, material]);

  useEffect(() => {
    const displacementBias = +debouncedDisplacementBias;

    if (isNaN(displacementBias)) {
      return;
    }

    if (initialDisplacementBias.current) {
      return;
    }

    if (material) {
      (material as PhongMaterial).displacementBias = displacementBias;
    }

    appContext.renderer.current?.render();
  }, [appContext.renderer, debouncedDisplacementBias, material]);

  return (
    <div className={'flex flex-col gap-y-1'}>
      <div
        className={`w-full flex flex-row justify-between p-1 cursor-pointer select-none border border-black  ${activeNode === data.node.nodeId ? 'bg-yellow-200 hover:bg-yellow-400' : 'hover:bg-gray-300'}`}
        onClick={() => {
          if (activeNode === data.node.nodeId) {
            setActiveNode(null);
          } else {
            setActiveNode(data.node.nodeId);
          }
        }}
      >
        <div className={'flex flex-row items-center gap-x-2'}>
          <Box className={'w-4 h-4'} />
          <h4>{nodeName}</h4>
        </div>
        <Button
          variant={'ghost'}
          size={'xs'}
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible((prev) => !prev);
            data.node.visible = !data.node.visible;
            appContext.renderer.current?.render();
          }}
        >
          {isVisible ? <Eye /> : <EyeOff />}
        </Button>
      </div>
      <div className={`${activeNode !== data.node.nodeId && 'hidden'}`}>
        <div className={'flex flex-col'}>
          <div className={'flex items-center gap-x-2'}>
            <p className={'font-medium text-sm'}>Name</p>
            <input
              className={'w-full max-w-[200px]'}
              type={'text'}
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
            />
          </div>
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <h4 className={'font-medium text-sm'}>Material</h4>
          <div className={'flex items-center gap-x-2'}>
            <p>type</p>
            <select
              onChange={(e) => {
                const value = e.target.value;
                setTexture(value);

                const texOption = TextureOptions.find((o) => o.name === value);

                if (!texOption || material === null) return;

                if (texOption.name === 'color') {
                  updateMaterialTexture(
                    material,
                    Color.fromHex(parseInt(`0x${color.substring(1)}`, 16)),
                    false,
                    true
                  );
                } else {
                  updateMaterialTexture(material, texOption);
                }

                appContext.renderer?.current?.render();
              }}
              value={texture || 'unknown'}
            >
              <option key={'unknown'} value={'unknown'} disabled>
                unknown
              </option>
              {TextureOptions.map((tex) => {
                return (
                  <option key={tex.name} value={tex.name}>
                    {tex.name}
                  </option>
                );
              })}
            </select>
          </div>
          {texture === 'color' && (
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
              {material instanceof PhongMaterial && (
                <>
                  <p>specular</p>
                  <input
                    className={'w-12'}
                    type={'color'}
                    value={specularColor}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSpecularColor(val);
                      initialSpecularColor.current = null;
                    }}
                  />
                </>
              )}
            </div>
          )}
          {material instanceof PhongMaterial && (
            <div className={'flex items-center gap-x-2'}>
              <p>shininess</p>
              <input
                className={'w-12'}
                type={'number'}
                value={shininess}
                onChange={(e) => {
                  const val = e.target.value;
                  setShininess(val);
                  initialShininess.current = null;
                }}
              />
            </div>
          )}
          {material instanceof PhongMaterial &&
            texture !== 'color' &&
            texture !== 'unknown' && (
              <div className={'flex items-center gap-x-2'}>
                <p>displacement scale</p>
                <input
                  className={'w-12'}
                  type={'number'}
                  value={displacementScale}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDisplacementScale(val);
                    initialDisplacementScale.current = null;
                  }}
                />
              </div>
            )}
          {material instanceof PhongMaterial &&
            texture !== 'color' &&
            texture !== 'unknown' && (
              <div className={'flex items-center gap-x-2'}>
                <p>displacement bias</p>
                <input
                  className={'w-12'}
                  type={'number'}
                  value={displacementBias}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDisplacementBias(val);
                    initialDisplacementBias.current = null;
                  }}
                />
              </div>
            )}
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
        <div className={'flex flex-col'}>
          <h4 className={'font-medium text-sm'}>Rotation</h4>
          <div className={'flex items-center gap-x-2'}>
            <p>x</p>
            <input
              className={'w-12'}
              type={'number'}
              value={rotation.x}
              onChange={(e) => {
                const val = e.target.value;
                setRotation((prev) => ({ ...prev, x: val }));
                initialRotation.current = null;
              }}
            />
            <p>y</p>
            <input
              className={'w-12'}
              type={'number'}
              value={rotation.y}
              onChange={(e) => {
                const val = e.target.value;
                setRotation((prev) => ({ ...prev, y: val }));
                initialRotation.current = null;
              }}
            />
            <p>z</p>
            <input
              className={'w-12'}
              type={'number'}
              value={rotation.z}
              onChange={(e) => {
                const val = e.target.value;
                setRotation((prev) => ({ ...prev, z: val }));
                initialRotation.current = null;
              }}
            />
          </div>
        </div>
        <div className={'flex flex-col'}>
          <h4 className={'font-medium text-sm'}>Scale</h4>
          <div className={'flex items-center gap-x-2'}>
            <p>x</p>
            <input
              className={'w-12'}
              type={'number'}
              value={scale.x}
              onChange={(e) => {
                const val = e.target.value;
                setScale((prev) => ({ ...prev, x: val }));
                initialScale.current = null;
              }}
            />
            <p>y</p>
            <input
              className={'w-12'}
              type={'number'}
              value={scale.y}
              onChange={(e) => {
                const val = e.target.value;
                setScale((prev) => ({ ...prev, y: val }));
                initialScale.current = null;
              }}
            />
            <p>z</p>
            <input
              className={'w-12'}
              type={'number'}
              value={scale.z}
              onChange={(e) => {
                const val = e.target.value;
                setScale((prev) => ({ ...prev, z: val }));
                initialScale.current = null;
              }}
            />
          </div>
        </div>
        <div className={'flex flex-col'}>
          <h4 className={'font-medium text-sm'}>Actions</h4>
          <div className={'flex flex-row items-center gap-x-2'}>
            <ComponentCreator node={data.node} triggerRender={triggerRender} />
            <MeshImporter node={data.node} triggerRender={triggerRender} />
            <MeshExporter node={data.node} />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={'xs'}
                  variant={'destructive'}
                  onClick={() => {
                    confirm({
                      title: 'Are you sure?',
                      body: 'Are you sure want to delete this component?'
                    }).then((r) => {
                      if (r) {
                        data.node.removeFromParent();
                        triggerRender();
                        appContext.renderer.current?.render();
                      }
                    });
                  }}
                >
                  <Trash className={'w-4 h-4'} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Component</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      {filtered.length !== 0 && (
        <div className={'flex flex-col gap-y-1 pl-2'}>
          {filtered.map((node) => {
            return (
              <NodeGraph
                key={node.nodeId}
                data={{ node }}
                activeNode={activeNode}
                setActiveNode={setActiveNode}
                triggerRender={triggerRender}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
