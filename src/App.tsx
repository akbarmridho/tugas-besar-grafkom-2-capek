import './style.css';
import { useEffect, useRef, useState } from 'react';
import { useWindowDimension } from '@/hooks/use-window-dimension.ts';
import { SaveAndLoad } from '@/components/save-and-load.tsx';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';
import { PerspectiveSelector } from '@/components/perspective-selector.tsx';
import { AnimationControl } from '@/components/animation-control.tsx';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [GL, setGL] = useState<WebGLRenderingContext | null>(null);
  const [width, height] = useWindowDimension();

  useEffect(() => {
    if (canvasRef.current) {
      setGL(canvasRef.current.getContext('webgl'));
    }
  }, []);

  return (
    <TooltipProvider>
      <div className={'w-full h-screen flex'}>
        <div className={'flex-grow h-full'}>
          <canvas
            ref={canvasRef}
            width={width - 300}
            height={height}
            style={{
              height,
              width: width - 300
            }}
          />
        </div>
        <div
          className={
            'border-l-2 border-gray-400 bg-slate-200 w-[300px] h-full flex flex-col p-2'
          }
        >
          <SaveAndLoad />
          <PerspectiveSelector />
          <AnimationControl />
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
