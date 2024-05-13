import { Button } from '@/components/ui/button.tsx';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pause,
  Play,
  Repeat
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip.tsx';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import { Toggle } from '@/components/ui/toggle.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';

export const AnimationControl = () => {
  return (
    <div>
      <h3 className={'text-md font-bold'}>Animation Control</h3>
      <div className={'flex'}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={'ghost'} size={'xs'}>
              <ChevronsLeft />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Jump To First Frame</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={'ghost'} size={'xs'}>
              <ChevronLeft />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Jump To Previous Frame</p>
          </TooltipContent>
        </Tooltip>
        <ToggleGroup type="single">
          <ToggleGroupItem value="Ortographic" size={'xs'}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Play className={'rotate-180'} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Play Reverse</p>
              </TooltipContent>
            </Tooltip>
          </ToggleGroupItem>
          <ToggleGroupItem value="Oblique" size={'xs'}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Pause />
              </TooltipTrigger>
              <TooltipContent>
                <p>Pause</p>
              </TooltipContent>
            </Tooltip>
          </ToggleGroupItem>
          <ToggleGroupItem value="Perspective" size={'xs'}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Play />
              </TooltipTrigger>
              <TooltipContent>
                <p>Play</p>
              </TooltipContent>
            </Tooltip>
          </ToggleGroupItem>
        </ToggleGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={'ghost'} size={'xs'}>
              <ChevronRight />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Jump To Next Frame</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={'ghost'} size={'xs'}>
              <ChevronsRight />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Jump To Last Frame</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className={'flex mt-2 items-center'}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle>
              <Repeat />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Always Repeat Animation</p>
          </TooltipContent>
        </Tooltip>
        <div className={'ml-2 flex items-center gap-x-3'}>
          <Label>FPS:</Label>
          <Input
            placeholder={'Animation FPS'}
            className={'w-16 h-8'}
            type={'number'}
            defaultValue={30}
          />
        </div>
      </div>
    </div>
  );
};
