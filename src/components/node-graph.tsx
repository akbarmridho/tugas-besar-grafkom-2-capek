import { Node } from '@/objects/base/node.ts';
import { Mesh } from '@/objects/mesh.ts';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { degreeToRadian, radianToDegree } from '@/utils/math/angle.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Euler } from '@/utils/math/euler.ts';
import { useApp } from '@/components/context.ts';

export interface NodeGraphData {
  node: Node;
}

interface NodeGraphProps {
  data: NodeGraphData;
  activeNode: string | null;
  setActiveNode: (id: string | null) => void;
}

interface XYZ {
  x: string;
  y: string;
  z: string;
}

export const NodeGraph = ({
  data,
  activeNode,
  setActiveNode
}: NodeGraphProps) => {
  const appContext = useApp();
  const filtered = data.node.children.filter((child) => child instanceof Mesh);
  const [nodeName, setNodeName] = useState<string>(data.node.name);
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

  const [debouncedNode] = useDebounce(nodeName, 200);
  const [debouncedPosition] = useDebounce(position, 200);
  const [debouncedRotation] = useDebounce(rotation, 200);
  const [debouncedScale] = useDebounce(scale, 200);

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

    data.node.setFromEulerRotation(
      new Euler(degreeToRadian(x), degreeToRadian(y), degreeToRadian(z))
    );
    appContext.renderer.current?.render();
  }, [appContext.renderer, data.node, debouncedRotation]);

  /** todo component
   * Component Editor
   * Menambahkan komponen baru sebagai anak dari existing component yang sedang dipilih. Objek default berupa kubus
   * dengan transformasi default. Jangan lupa memperbarui Scene Graph.
   * Menghapus komponen yang sedang dipilih.
   * Melakukan ekspor komponen (tunggal/subtree) dari komponen yang sedang terpilih.
   * Melakukan impor komponen (tunggal/subtree) untuk ditambahkan menjadi anak dari komponen yang sedang terpilih atau
   * mengubah komponen yang sedang terpilih.
   *
   * Material
   * Tampilkan antarmuka untuk mengubah material setiap mesh.
   */
  return (
    <div className={'flex flex-col gap-y-1'}>
      <div
        className={`w-full p-1 cursor-pointer select-none border border-black  ${activeNode === data.node.name ? 'bg-yellow-200 hover:bg-yellow-400' : 'hover:bg-gray-300'}`}
        onClick={() => {
          if (activeNode === data.node.name) {
            setActiveNode(null);
          } else {
            setActiveNode(data.node.name);
          }
        }}
      >
        {nodeName}
      </div>
      <div className={`${activeNode !== data.node.name && 'hidden'}`}>
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
              }}
            />
          </div>
        </div>
      </div>
      {filtered.length !== 0 && (
        <div className={'flex flex-col gap-y-1 pl-2'}>
          {filtered.map((node) => {
            return (
              <NodeGraph
                key={node.name}
                data={{ node }}
                activeNode={activeNode}
                setActiveNode={setActiveNode}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
