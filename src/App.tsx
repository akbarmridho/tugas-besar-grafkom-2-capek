import './style.css';
import { useEffect, useRef, useState } from 'react';
import { SaveAndLoad } from '@/components/save-and-load.tsx';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';
import { PerspectiveSelector } from '@/components/perspective-selector.tsx';
import { AnimationControl } from '@/components/animation-control.tsx';
import { SceneGraph } from '@/components/scene-graph.tsx';
import { AppContext } from '@/components/context.ts';
import { Coordinate, getCoordinate } from '@/utils/coordinates.ts';
import { WebGLRenderer } from '@/objects/renderer.ts';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const GLRef = useRef<WebGLRenderingContext | null>(null);
  const run = useRef<boolean>(false);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const [startClick, setStartClick] = useState<Coordinate | null>(null);

  useEffect(() => {
    if (canvasRef.current && !run.current) {
      run.current = true;
      GLRef.current = canvasRef.current.getContext('webgl');
      rendererRef.current = new WebGLRenderer(
        canvasRef.current,
        GLRef.current!
      );
    }
  }, []);

  return (
    <TooltipProvider>
      <AppContext.Provider
        value={{
          gl: GLRef,
          canvas: canvasRef,
          renderer: rendererRef
        }}
      >
        <div className={'w-full h-screen flex'}>
          <div className={'flex-grow h-full'}>
            <canvas
              ref={canvasRef}
              className={'w-full h-full'}
              onWheel={(e) => {
                // console.log(e.deltaY);
                /** todo implement zoom in-out of camera here
                 * value of deltaY is always the same
                 * scroll down is positive
                 * scroll up is negative
                 */
              }}
              onMouseDown={(e) => {
                setStartClick(getCoordinate(canvasRef.current!, e));
              }}
              onMouseUp={(e) => {
                setStartClick(null);
              }}
              onMouseMove={(e) => {
                if (startClick === null) {
                  return;
                }

                const currentCoord = getCoordinate(canvasRef.current!, e);
                const delta: Coordinate = {
                  x: currentCoord.x - startClick.x,
                  y: currentCoord.y - startClick.y
                };

                // console.log(delta);
              }}
            />
          </div>
          <div
            className={
              'border-l-2 border-gray-400 bg-slate-200 w-[300px] h-full flex flex-col p-2'
            }
          >
            {/** todo component
             * Untuk objek global yang mempunyai satu instance seperti kamera dan cahaya, antarmuka untuk mengatur
             * propertinya dapat ditampilkan selalu tanpa perlu di-klik pada struktur pohon tersebut
             * (dapat juga dihilangkan pada struktur pohon).
             */}
            <SaveAndLoad />
            <PerspectiveSelector />
            <AnimationControl />
            <SceneGraph />
          </div>
        </div>
      </AppContext.Provider>
    </TooltipProvider>
  );
}

export default App;
