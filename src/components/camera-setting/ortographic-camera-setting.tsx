import { OrthographicCamera } from '@/objects/camera/orthographic-camera.ts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useApp } from '@/components/context.ts';

interface OrthographicProjectionValue {
  top: string;
  bottom: string;
  left: string;
  right: string;
  near: string;
  far: string;
}

export function OrthographicCameraSetting({
  camera
}: {
  camera: OrthographicCamera;
}) {
  const appContext = useApp();
  const [projection, setProjection] = useState<OrthographicProjectionValue>({
    top: String(camera._baseProjection.top),
    bottom: String(camera._baseProjection.bottom),
    left: String(camera._baseProjection.left),
    right: String(camera._baseProjection.right),
    near: String(camera._baseProjection.near),
    far: String(camera._baseProjection.far)
  });

  const [shouldRender, setShouldRender] = useState<boolean>(false);

  const cb = useCallback(() => {
    setShouldRender(!shouldRender);
    setProjection({
      top: String(camera._baseProjection.top),
      bottom: String(camera._baseProjection.bottom),
      left: String(camera._baseProjection.left),
      right: String(camera._baseProjection.right),
      near: String(camera._baseProjection.near),
      far: String(camera._baseProjection.far)
    });
  }, [shouldRender]);

  useEffect(() => {
    const renderer = appContext.renderer.current;

    if (renderer !== null) {
      renderer.onCameraReset.add(cb);
    }

    return () => {
      appContext.renderer.current?.onCameraReset.delete(cb);
    };
  }, [appContext.renderer, cb]);

  const initialProjection = useRef<OrthographicProjectionValue | null>({
    ...projection
  });

  const [debouncedProjection] = useDebounce(projection, 200);

  useEffect(() => {
    const top = +debouncedProjection.top;
    const bottom = +debouncedProjection.bottom;
    const left = +debouncedProjection.left;
    const right = +debouncedProjection.right;
    const near = +debouncedProjection.near;
    const far = +debouncedProjection.far;

    if (
      isNaN(top) ||
      isNaN(bottom) ||
      isNaN(left) ||
      isNaN(right) ||
      isNaN(near) ||
      isNaN(far)
    ) {
      return;
    }
    if (
      initialProjection.current &&
      top === +initialProjection.current.top &&
      bottom === +initialProjection.current.bottom &&
      left === +initialProjection.current.left &&
      right === +initialProjection.current.right &&
      near === +initialProjection.current.near &&
      far === +initialProjection.current.far
    ) {
      return;
    }

    camera.baseProjection = { top, bottom, left, right, near, far };
    appContext.renderer.current?.render();
  }, [appContext.renderer, camera, debouncedProjection]);

  return (
    <div className={'flex flex-col gap-y-2'}>
      <h4 className={'font-medium text-sm'}>Projection</h4>
      <div className={'flex items-center gap-x-2'}>
        <p>top</p>
        <input
          className={'w-12'}
          type={'number'}
          value={projection.top}
          onChange={(e) => {
            const val = e.target.value;
            setProjection((prev) => ({ ...prev, top: val }));
            initialProjection.current = null;
          }}
        />
        <p>bottom</p>
        <input
          className={'w-12'}
          type={'number'}
          value={projection.bottom}
          onChange={(e) => {
            const val = e.target.value;
            setProjection((prev) => ({ ...prev, bottom: val }));
            initialProjection.current = null;
          }}
        />
      </div>
      <div className={'flex items-center gap-x-2'}>
        <p>left</p>
        <input
          className={'w-12'}
          type={'number'}
          value={projection.left}
          onChange={(e) => {
            const val = e.target.value;
            setProjection((prev) => ({ ...prev, left: val }));
            initialProjection.current = null;
          }}
        />
        <p>right</p>
        <input
          className={'w-12'}
          type={'number'}
          value={projection.right}
          onChange={(e) => {
            const val = e.target.value;
            setProjection((prev) => ({ ...prev, right: val }));
            initialProjection.current = null;
          }}
        />
      </div>
      <div className={'flex items-center gap-x-2'}>
        <p>near</p>
        <input
          className={'w-12'}
          type={'number'}
          value={projection.near}
          onChange={(e) => {
            const val = e.target.value;
            setProjection((prev) => ({ ...prev, near: val }));
            initialProjection.current = null;
          }}
        />
        <p>far</p>
        <input
          className={'w-12'}
          type={'number'}
          value={projection.far}
          onChange={(e) => {
            const val = e.target.value;
            setProjection((prev) => ({ ...prev, far: val }));
            initialProjection.current = null;
          }}
        />
      </div>
    </div>
  );
}
