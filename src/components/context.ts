import { createContext, RefObject, useContext } from 'react';
import { WebGLRenderer } from '@/objects/renderer.ts';

export interface AppContextValue {
  gl: RefObject<WebGLRenderingContext | null>;
  canvas: RefObject<HTMLCanvasElement | null>;
  renderer: RefObject<WebGLRenderer | null>;
}

export const AppContext = createContext<AppContextValue>({} as AppContextValue);

export const useApp = () => useContext(AppContext);
