import { Button } from '@/components/ui/button.tsx';
import { Box, Diamond, Package2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip.tsx';
import { useApp } from '@/components/context.ts';

export const PerspectiveSelector = () => {
  const appContext = useApp();

  return (
    <div>
      <h3 className={'text-md font-bold'}>Projection</h3>
      <div className={'flex gap-x-2'}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={'icon'}
              variant={
                appContext.selectedCamera === 'orthogonal' ? 'default' : 'ghost'
              }
              disabled={
                !appContext.cameraSelector.orthogonal ||
                appContext.selectedCamera === 'orthogonal'
              }
              onClick={() => {
                const renderer = appContext.renderer.current!;
                renderer.selectedCamera = 'orthogonal';
                appContext.setSelectedCamera('orthogonal');
                renderer.render();
              }}
            >
              <Box />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Orthographic Projection</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={'icon'}
              variant={
                appContext.selectedCamera === 'oblique' ? 'default' : 'ghost'
              }
              disabled={
                !appContext.cameraSelector.oblique ||
                appContext.selectedCamera === 'oblique'
              }
              onClick={() => {
                const renderer = appContext.renderer.current!;
                renderer.selectedCamera = 'oblique';
                appContext.setSelectedCamera('oblique');
                renderer.render();
              }}
            >
              <Diamond />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Oblique Projection</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={'icon'}
              variant={
                appContext.selectedCamera === 'perspective'
                  ? 'default'
                  : 'ghost'
              }
              disabled={
                !appContext.cameraSelector.perspective ||
                appContext.selectedCamera === 'perspective'
              }
              onClick={() => {
                const renderer = appContext.renderer.current!;
                renderer.selectedCamera = 'perspective';
                appContext.setSelectedCamera('perspective');
                renderer.render();
              }}
            >
              <Package2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Perspective Projection</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
