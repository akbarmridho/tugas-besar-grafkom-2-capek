import './style.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SaveAndLoad } from '@/components/save-and-load.tsx';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';
import { PerspectiveSelector } from '@/components/perspective-selector.tsx';
import { AnimationControl } from '@/components/animation-control.tsx';
import { SceneGraph } from '@/components/scene-graph.tsx';
import { AppContext, CameraAvailability } from '@/components/context.ts';
import { Coordinate, getCoordinate } from '@/utils/coordinates.ts';
import { WebGLRenderer } from '@/objects/renderer.ts';
import { CameraSelection } from '@/interfaces/camera.ts';
import { Scene } from '@/objects/scene.ts';
import { degreeToRadian } from '@/utils/math/angle.ts';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const GLRef = useRef<WebGLRenderingContext | null>(null);
  const run = useRef<boolean>(false);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const [cameraSelector, setCameraSelector] = useState<CameraAvailability>({
    oblique: false,
    orthogonal: false,
    perspective: false
  });

  const [selectedCamera, setSelectedCamera] = useState<CameraSelection>(null);

  const cb = useCallback(
    (
      scene: Scene,
      selection: CameraSelection,
      availability: CameraAvailability
    ) => {
      setCameraSelector(availability);
      setSelectedCamera(selection);
    },
    []
  );

  useEffect(() => {
    if (canvasRef.current && !run.current) {
      GLRef.current = canvasRef.current.getContext('webgl');
      const renderer = new WebGLRenderer(canvasRef.current, GLRef.current!);
      rendererRef.current = renderer;
      renderer.onSceneChanged.add(cb);
      run.current = true;
    }
  }, [cb]);

  return (
    <TooltipProvider>
      <AppContext.Provider
        value={{
          gl: GLRef,
          canvas: canvasRef,
          renderer: rendererRef,
          cameraSelector,
          selectedCamera,
          setCameraSelector,
          setSelectedCamera
        }}
      >
        <div
          className={
            'w-full h-screen flex flex-row justify-center bg-slate-100 overflow-x-auto'
          }
        >
          <div
            className={
              'border-l-2 border-r-2 border-gray-400 bg-slate-200 w-[250px] h-full flex flex-col p-2'
            }
          >
            <SceneGraph />
          </div>
          <div className={'h-full aspect-square'}>
            <canvas
              ref={canvasRef}
              className={'w-full h-full'}
              onWheel={(e) => {
                rendererRef.current?.currentOrbitControl?.handleZoom(
                  e.deltaY < 0
                );
                rendererRef.current?.render();
              }}
              onMouseDown={(e) => {
                if (e.button !== 0) {
                  return;
                }
                rendererRef.current?.currentOrbitControl?.handleMouseDownRotate(
                  getCoordinate(canvasRef.current!, e)
                );
              }}
              onMouseUp={(e) => {
                rendererRef.current?.currentOrbitControl?.handleMouseUpRotate();
              }}
              onMouseLeave={() => {
                rendererRef.current?.currentOrbitControl?.handleMouseUpRotate();
              }}
              onMouseMove={(e) => {
                if (
                  rendererRef.current?.currentOrbitControl?.handleMouseMoveRotate(
                    getCoordinate(canvasRef.current!, e)
                  )
                ) {
                  rendererRef.current?.render();
                }
              }}
            />
          </div>
          <div
            className={
              'border-l-2 border-r-2 border-gray-400 bg-slate-200 w-[250px] h-full flex flex-col p-2'
            }
          >
            <SaveAndLoad />
            <AnimationControl />
            <PerspectiveSelector />
          </div>
        </div>
      </AppContext.Provider>
    </TooltipProvider>
  );
}

export default App;
