import { createContext, RefObject, useContext } from 'react';
import { WebGLRenderer } from '@/objects/renderer.ts';
import { CameraSelection } from '@/interfaces/camera.ts';

export interface CameraAvailability {
  orthogonal: boolean;
  perspective: boolean;
  oblique: boolean;
}

export interface AppContextValue {
  gl: RefObject<WebGLRenderingContext | null>;
  canvas: RefObject<HTMLCanvasElement | null>;
  renderer: RefObject<WebGLRenderer | null>;
  cameraSelector: CameraAvailability;
  selectedCamera: CameraSelection;
  setSelectedCamera: (val: CameraSelection) => void;
  setCameraSelector: (val: CameraAvailability) => void;
}

export const AppContext = createContext<AppContextValue>({} as AppContextValue);

export const useApp = () => useContext(AppContext);
