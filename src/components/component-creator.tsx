import { Copy, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Node } from '@/objects/base/node.ts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { useState } from 'react';
import { useApp } from '@/components/context.ts';
import { ShaderMaterial } from '@/objects/base/shader-material.ts';
import { PhongMaterial } from '@/objects/material/phong-material.ts';
import { Color } from '@/objects/base/color.ts';
import { BasicMaterial } from '@/objects/material/basic-material.ts';
import { BufferGeometry } from '@/objects/base/buffer-geometry.ts';
import { BoxGeometry } from '@/objects/geometry/box-geometry.ts';
import { CylinderGeometry } from '@/objects/geometry/cylinder-geometry.ts';
import { PlaneGeometry } from '@/objects/geometry/plane-geometry.ts';
import { PrismGeometry } from '@/objects/geometry/prism-geometry.ts';
import { PyramidGeometry } from '@/objects/geometry/pyramid-geometry.ts';
import { SphereGeometry } from '@/objects/geometry/sphere-geometry.ts';
import { Mesh } from '@/objects/mesh.ts';
import { PointLight } from '@/objects/light/point-light.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip.tsx';

export interface ComponentCreatorProps {
  node: Node;
  triggerRender: () => void;
  withLight?: boolean;
}

export function ComponentCreator({
  node,
  triggerRender,
  withLight
}: ComponentCreatorProps) {
  const appContext = useApp();
  const [open, setOpen] = useState<boolean>(false);
  const [geometry, setGeometry] = useState<string>('');
  const [material, setMaterial] = useState<string>('');

  const handleAdd = () => {
    const renderer = appContext.renderer.current;

    if (renderer === null) {
      return;
    }

    if (geometry === 'point-light') {
      const pointLight = new PointLight(
        'new-point-light',
        Color.Blue(),
        0.5,
        new Vector3(0, 1, 0)
      );
      node.addChildren(pointLight);

      const pointLightMaterial = new BasicMaterial(Color.Blue());
      const pointLightShape = new BoxGeometry(0.025, 0.025, 0.025);

      const pointLightMesh = new Mesh(
        'new-point-light-mesh',
        pointLightShape,
        pointLightMaterial,
        new Vector3(0, 1, 0)
      );

      renderer.programFromMaterial(pointLightMaterial);
      node.addChildren(pointLightMesh);
    } else {
      let mat: ShaderMaterial;

      if (material === 'phong') {
        mat = new PhongMaterial(Color.Black(), Color.Red(), Color.Blue(), 0.5);
      } else {
        mat = new BasicMaterial(Color.Red());
      }

      let shape: BufferGeometry;

      if (geometry === 'box') {
        shape = new BoxGeometry(0.5, 0.5, 0.5);
      } else if (geometry === 'cylinder') {
        shape = new CylinderGeometry(0.25, 0.25, 0.5, 64, 64);
      } else if (geometry === 'plane') {
        shape = new PlaneGeometry(0.5, 0.5);
      } else if (geometry === 'pyramid') {
        shape = new PyramidGeometry(0.5, 0.5, 0.5);
      } else if (geometry === 'sphere') {
        shape = new SphereGeometry(0.5);
      } else {
        shape = new BoxGeometry(0.5, 0.5, 0.5);
      }

      const mesh = new Mesh('new component', shape, mat);
      renderer.programFromMaterial(mat);
      node.addChildren(mesh);
    }

    setOpen(false);
    setGeometry('');
    setMaterial('');
    triggerRender();
    renderer.render();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size={'xs'}>
              <Plus className={'w-4 h-4'} />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add Component</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Component</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-y-2">
          <div>
            <Label>Shape</Label>
            <Select value={geometry} onValueChange={setGeometry}>
              <SelectTrigger>
                <SelectValue placeholder="Shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="box">Box</SelectItem>
                <SelectItem value="cylinder">Cylinder</SelectItem>
                <SelectItem value="plane">Plane</SelectItem>
                {/*<SelectItem value="prism">Prism</SelectItem>*/}
                <SelectItem value="pyramid">Pyramid</SelectItem>
                <SelectItem value="sphere">Sphere</SelectItem>
                {withLight && (
                  <SelectItem value="point-light">Point Light</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          {geometry !== 'point-light' && (
            <div>
              <Label>Material</Label>
              <Select value={material} onValueChange={setMaterial}>
                <SelectTrigger>
                  <SelectValue placeholder="Material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Material</SelectItem>
                  <SelectItem value="phong">Phong Material</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={
              geometry === '' || (material === '' && geometry !== 'point-light')
            }
            onClick={handleAdd}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
