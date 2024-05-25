import { ArrowRightFromLine, Copy, Plus } from 'lucide-react';

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
import { serializeScene } from '@/objects/parser/serializer.ts';
import { createBaseExportScene } from '@/factory/exporter.ts';

export interface MeshExporterProps {
  node: Node;
}

export function MeshExporter({ node }: MeshExporterProps) {
  return (
    <Button
      variant="ghost"
      size={'xs'}
      onClick={() => {
        showSaveFilePicker({
          types: [
            {
              description: 'Saved mesh data',
              accept: {
                'model/gltf+json': ['.gltf'],
                'application/json': ['.json']
              }
            }
          ]
        })
          .then((handle) => {
            handle.createWritable().then((writeable) => {
              const { scene: baseScene } = createBaseExportScene(node.name);

              const parent = node.parent;
              const idx = parent?.children.findIndex((c) => c === node);

              node.removeFromParent();

              baseScene.addChildren(node);

              const serialized = serializeScene(baseScene);

              parent?.addChildren(node, idx);

              writeable.write(JSON.stringify(serialized)).then(() => {
                void writeable.close();
              });
            });
          })
          .catch((e) => {
            // ignore
          });
      }}
    >
      <ArrowRightFromLine className={'w-4 h-4'} />
    </Button>
  );
}
