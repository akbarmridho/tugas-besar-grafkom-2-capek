import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';

export interface NodeGraphData {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  children: NodeGraphData[];
}

interface NodeGraphProps {
  data: NodeGraphData;
  activeNode: string | null;
  setActiveNode: (id: string | null) => void;
}

export const NodeGraph = ({
  data,
  activeNode,
  setActiveNode
}: NodeGraphProps) => {
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
        className={`w-full p-1 cursor-pointer select-none border border-black  ${activeNode === data.id ? 'bg-yellow-200 hover:bg-yellow-400' : 'hover:bg-gray-300'}`}
        onClick={() => {
          if (activeNode === data.id) {
            setActiveNode(null);
          } else {
            setActiveNode(data.id);
          }
        }}
      >
        {data.name}
      </div>
      <div className={`${activeNode !== data.id && 'hidden'}`}>
        <div className={'flex flex-col'}>
          <div className={'flex items-center gap-x-2'}>
            <p className={'font-medium text-sm'}>Name</p>
            <input className={'w-12'} type={'text'} />
          </div>
        </div>
        <div className={'flex flex-col'}>
          <h4 className={'font-medium text-sm'}>Position</h4>
          <div className={'flex items-center gap-x-2'}>
            <p>x</p>
            <input className={'w-12'} type={'number'} />
            <p>y</p>
            <input className={'w-12'} type={'number'} />
            <p>z</p>
            <input className={'w-12'} type={'number'} />
          </div>
        </div>
        <div className={'flex flex-col'}>
          <h4 className={'font-medium text-sm'}>Rotation</h4>
          <div className={'flex items-center gap-x-2'}>
            <p>x</p>
            <input className={'w-12'} type={'number'} />
            <p>y</p>
            <input className={'w-12'} type={'number'} />
            <p>z</p>
            <input className={'w-12'} type={'number'} />
          </div>
        </div>
        <div className={'flex flex-col'}>
          <h4 className={'font-medium text-sm'}>Scale</h4>
          <div className={'flex items-center gap-x-2'}>
            <p>x</p>
            <input className={'w-12'} type={'number'} />
            <p>y</p>
            <input className={'w-12'} type={'number'} />
            <p>z</p>
            <input className={'w-12'} type={'number'} />
          </div>
        </div>
      </div>
      {data.children.length !== 0 && (
        <div className={'flex flex-col gap-y-1 pl-2'}>
          {data.children.map((node) => (
            <NodeGraph
              key={node.id}
              data={node}
              activeNode={activeNode}
              setActiveNode={setActiveNode}
            />
          ))}
        </div>
      )}
    </div>
  );
};
