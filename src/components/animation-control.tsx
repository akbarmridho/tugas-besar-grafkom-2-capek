import { Button } from '@/components/ui/button.tsx';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Option,
  Play,
  Repeat,
  Square
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip.tsx';
import { Toggle } from '@/components/ui/toggle.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useApp } from '@/components/context.ts';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { TweenOptions } from '@/utils/math/tweener.ts';

export const AnimationControl = () => {
  const appContext = useApp();
  const [playState, setPlayState] = useState<
    'playing' | 'playing-backward' | 'stopped'
  >('stopped');
  const [alwaysRepeat, setAlwaysRepeat] = useState<boolean>(true);
  const [rawFps, setRawFps] = useState<string>('30');
  const [debouncedFps] = useDebounce(rawFps, 200);
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [tween, setTween] = useState<string>('none');

  useEffect(() => {
    if (tween !== '' && tween !== 'none') {
      const fn = TweenOptions.find((t) => t.name === tween);

      if (fn) {
        appContext.renderer.current?.tweenClip(fn);
      }
    }
  }, [appContext.renderer, tween]);

  const cb = useCallback(() => {
    setShouldRender(!shouldRender);
  }, [shouldRender]);

  useEffect(() => {
    const renderer = appContext.renderer.current;

    if (renderer !== null) {
      renderer.onSceneChanged.add(cb);
    }

    return () => {
      appContext.renderer.current?.onSceneChanged.delete(cb);
    };
  }, [appContext.renderer, cb]);

  useEffect(() => {
    const val = +debouncedFps;

    if (!isNaN(val)) {
      appContext.renderer?.current?.setFps(
        Math.min(144, Math.max(Math.floor(val), 1))
      );
    }
  }, [appContext.renderer, debouncedFps]);

  if (
    appContext.renderer.current === null ||
    appContext.renderer.current?.model === null
  ) {
    return <></>;
  }

  const renderer = appContext.renderer.current!;

  if (!renderer.model!.animationClip) {
    return (
      <div>
        <p>Animation Control disabled. No Animation data.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className={'text-md font-bold'}>Animation Control</h3>
      <div className={'flex'}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'ghost'}
              size={'xs'}
              onClick={() => {
                renderer.toFirstFrame();
                setPlayState('stopped');
              }}
            >
              <ChevronsLeft />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Jump To First Frame</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'ghost'}
              size={'xs'}
              onClick={() => {
                renderer.toPrevFrame();
                setPlayState('stopped');
              }}
            >
              <ChevronLeft />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Jump To Previous Frame</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'ghost'}
              size={'xs'}
              disabled={playState !== 'stopped'}
              onClick={() => {
                renderer.startBackward();

                if (alwaysRepeat) {
                  setPlayState('playing-backward');
                }
              }}
            >
              <Play className={'rotate-180'} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Play Reverse</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'ghost'}
              size={'xs'}
              disabled={playState === 'stopped'}
              onClick={() => {
                renderer.stop();
                renderer.toFirstFrame();
                setPlayState('stopped');
              }}
            >
              <Square />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Stop</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'ghost'}
              size={'xs'}
              disabled={playState !== 'stopped'}
              onClick={() => {
                renderer.startForward();

                if (alwaysRepeat) {
                  setPlayState('playing');
                }
              }}
            >
              <Play />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Play</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'ghost'}
              size={'xs'}
              onClick={() => {
                renderer.toNextFrame();
                setPlayState('stopped');
              }}
            >
              <ChevronRight />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Jump To Next Frame</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'ghost'}
              size={'xs'}
              onClick={() => {
                renderer.toLastFrame();
                setPlayState('stopped');
              }}
            >
              <ChevronsRight />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Jump To Last Frame</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className={'flex mt-2 items-center'}>
        <Toggle
          className={'h-7 rounded-sm px-1'}
          pressed={alwaysRepeat}
          onPressedChange={(val) => {
            setAlwaysRepeat(val);
            renderer.setRepeat(val);
          }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Repeat />
            </TooltipTrigger>
            <TooltipContent>
              <p>Always Repeat Animation</p>
            </TooltipContent>
          </Tooltip>
        </Toggle>
        <div className={'ml-2 flex items-center gap-x-3'}>
          <Label>FPS:</Label>
          <Input
            placeholder={'Animation FPS'}
            className={'w-16 h-8'}
            type={'number'}
            min={1}
            max={144}
            defaultValue={rawFps}
            onChange={(e) => {
              setRawFps(e.target.value);
            }}
          />
        </div>
      </div>
      <div className={'flex mt-2 items-center'}>
        <Label>Tweening Function</Label>
        <Select value={tween} onValueChange={setTween}>
          <SelectTrigger>
            <SelectValue placeholder={'Tweening function'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'none'} key={'none'}>
              None
            </SelectItem>
            {TweenOptions.map((option) => {
              return (
                <SelectItem value={option.name} key={option.name}>
                  {option.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
