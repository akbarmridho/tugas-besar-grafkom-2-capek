import { Button } from '@/components/ui/button.tsx';
import { Box, Diamond, Package2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip.tsx';
import { useApp } from '@/components/context.ts';
import { useCallback, useEffect, useState } from 'react';
import { CameraSelection } from '@/interfaces/camera.ts';
import { OrthographicCameraSetting } from '@/components/camera-setting/ortographic-camera-setting.tsx';
import { OrthographicCamera } from '@/objects/camera/orthographic-camera.ts';
import { PerspectiveCamera } from '@/objects/camera/perspective-camera.ts';
import { ObliqueCamera } from '@/objects/camera/oblique-camera.ts';
import { ObliqueCameraSetting } from '@/components/camera-setting/oblique-camera-setting.tsx';
import { PerspectiveCameraSetting } from '@/components/camera-setting/perspective-camera-setting.tsx';

export const PerspectiveSelector = () => {
  const appContext = useApp();
  const [selectedCamera, setSelectedCamera] = useState<CameraSelection>(
    appContext.selectedCamera
  );

  useEffect(() => {
    setSelectedCamera(appContext.selectedCamera);
  }, [appContext.selectedCamera]);

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
                setSelectedCamera('orthogonal');
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
                setSelectedCamera('oblique');
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
                setSelectedCamera('perspective');
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
      <h3 className={'text-md font-bold'}>Camera Setting</h3>
      <div>
        {selectedCamera === 'orthogonal' && (
          <OrthographicCameraSetting
            camera={
              appContext.renderer.current!.camera
                .orthogonal as OrthographicCamera
            }
          />
        )}
        {selectedCamera === 'perspective' && (
          <PerspectiveCameraSetting
            camera={
              appContext.renderer.current!.camera
                .perspective as PerspectiveCamera
            }
          />
        )}
        {selectedCamera === 'oblique' && (
          <ObliqueCameraSetting
            camera={
              appContext.renderer.current!.camera.oblique as ObliqueCamera
            }
          />
        )}
      </div>
    </div>
  );
};
