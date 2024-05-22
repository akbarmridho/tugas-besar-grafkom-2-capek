import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useApp } from '@/components/context.ts';
import { PerspectiveCamera } from '@/objects/camera/perspective-camera.ts';

interface PerspectiveProjectionValue {
  fov: string;
  aspect: string;
  near: string;
  far: string;
}

export function PerspectiveCameraSetting({
  camera
}: {
  camera: PerspectiveCamera;
}) {
  const appContext = useApp();
  const [projection, setProjection] = useState<PerspectiveProjectionValue>({
    fov: String(camera._baseProjection.fov),
    aspect: String(camera._baseProjection.aspect),
    near: String(camera._baseProjection.near),
    far: String(camera._baseProjection.far)
  });

  const [shouldRender, setShouldRender] = useState<boolean>(false);

  const cb = useCallback(() => {
    setShouldRender(!shouldRender);
    setProjection({
      fov: String(camera._baseProjection.fov),
      aspect: String(camera._baseProjection.aspect),
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

  const initialProjection = useRef<PerspectiveProjectionValue | null>({
    ...projection
  });

  const [debouncedProjection] = useDebounce(projection, 200);

  useEffect(() => {
    const fov = +debouncedProjection.fov;
    const aspect = +debouncedProjection.aspect;
    const near = +debouncedProjection.near;
    const far = +debouncedProjection.far;

    if (isNaN(fov) || isNaN(aspect) || isNaN(near) || isNaN(far)) {
      return;
    }
    if (
      initialProjection.current &&
      fov === +initialProjection.current.fov &&
      aspect === +initialProjection.current.aspect &&
      near === +initialProjection.current.near &&
      far === +initialProjection.current.far
    ) {
      return;
    }

    camera.baseProjection = { fov, aspect, near, far };
    appContext.renderer.current?.render();
  }, [appContext.renderer, camera, debouncedProjection]);

  return (
    <div className={'flex flex-col gap-y-2'}>
      <h4 className={'font-medium text-sm'}>Projection</h4>
      <div className={'flex items-center gap-x-2'}>
        <p>fov</p>
        <input
          className={'w-12'}
          type={'number'}
          value={projection.fov}
          onChange={(e) => {
            const val = e.target.value;
            setProjection((prev) => ({ ...prev, fov: val }));
            initialProjection.current = null;
          }}
        />
        <p>aspect</p>
        <input
          className={'w-12'}
          type={'number'}
          value={projection.aspect}
          onChange={(e) => {
            const val = e.target.value;
            setProjection((prev) => ({ ...prev, aspect: val }));
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
