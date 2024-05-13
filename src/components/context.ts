import { createContext, RefObject, useContext } from 'react';

export interface AppContextValue {
  gl: WebGLRenderingContext;
  canvas: RefObject<HTMLCanvasElement | null>;
}

export const AppContext = createContext<AppContextValue>({} as AppContextValue);

export const useApp = () => useContext(AppContext);
