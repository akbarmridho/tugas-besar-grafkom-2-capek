import { Button } from '@/components/ui/button.tsx';
import { FolderOpen, RotateCcw, Save } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip.tsx';

export const SaveAndLoad = () => {
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
                showSaveFilePicker({
                  types: [
                    {
                      description: 'Saved scene data',
                      accept: {
                        'model/gltf+json': ['.gltf']
                      }
                    }
                  ]
                })
                  .then((handle) => {
                    handle.createWritable().then((writeable) => {
                      // todo change this
                      writeable.write('todo ganti').then(() => {
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
                showOpenFilePicker({
                  multiple: false,
                  types: [
                    {
                      description: 'Saved scene data',
                      accept: {
                        'model/gltf+json': ['.gltf']
                      }
                    }
                  ]
                })
                  .then((handlers) => {
                    const handle = handlers[0];

                    handle.getFile().then((file) => {
                      file.text().then((rawResult) => {
                        console.log(rawResult);
                      });
                    });
                  })
                  .catch((e) => {
                    // ignore
                  });
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
            <Button variant={'ghost'} size={'icon'}>
              <RotateCcw />
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
