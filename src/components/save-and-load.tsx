import { Button } from '@/components/ui/button.tsx';
import { FolderOpen, RotateCcw, Save, SwitchCamera } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip.tsx';
import { neoArmstrongCycloneJetArmstrongCannon } from '@/factory/neo-armstrong-cyclone-jet-armstrong-cannon.ts';
import { parseModel } from '@/objects/parser/parser.ts';
import { useApp } from '@/components/context.ts';
import { PModel } from '@/interfaces/parser.ts';
import { serializeScene } from '@/objects/parser/serializer.ts';

type seederFunc = () => PModel;
const PRE_SEED_MODEL = true;
const seeder: seederFunc | null = neoArmstrongCycloneJetArmstrongCannon;

export const SaveAndLoad = () => {
  const app = useApp();

  return (
    <div>
      <h3 className={'text-md font-bold'}>Project</h3>
      <div className={'flex gap-x-2'}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'ghost'}
              size={'icon'}
              onClick={() => {
                const renderer = app.renderer.current!;

                if (renderer.model === null) {
                  return;
                }

                showSaveFilePicker({
                  types: [
                    {
                      description: 'Saved scene data',
                      accept: {
                        'model/gltf+json': ['.gltf'],
                        'application/json': ['.json']
                      }
                    }
                  ]
                })
                  .then((handle) => {
                    handle.createWritable().then((writeable) => {
                      const serialized = serializeScene(renderer.model!.scene);

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
              <Save />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save current project</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'ghost'}
              size={'icon'}
              onClick={() => {
                /**
                 * DEBUG LINES
                 */
                if (PRE_SEED_MODEL) {
                  const renderer = app.renderer.current!;
                  const serialized = seeder!();

                  const parsed = parseModel(serialized);
                  renderer.updateFromParsedModel(parsed);
                  renderer.render();
                } else {
                  showOpenFilePicker({
                    multiple: false,
                    types: [
                      {
                        description: 'Saved scene data',
                        accept: {
                          'model/gltf+json': ['.gltf'],
                          'application/json': ['.json']
                        }
                      }
                    ]
                  })
                    .then((handlers) => {
                      const handle = handlers[0];

                      handle.getFile().then((file) => {
                        file.text().then((rawResult) => {
                          const renderer = app.renderer.current!;
                          const parsed = parseModel(JSON.parse(rawResult));
                          renderer.updateFromParsedModel(parsed);
                          renderer.render();
                        });
                      });
                    })
                    .catch((e) => {
                      // ignore
                    });
                }
              }}
            >
              <FolderOpen />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open a new project</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'ghost'}
              size={'icon'}
              onClick={() => {
                const renderer = app.renderer.current!;

                if (renderer.selectedCamera !== null) {
                  renderer.resetCamera();
                }
              }}
            >
              <SwitchCamera />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset Camera View</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
