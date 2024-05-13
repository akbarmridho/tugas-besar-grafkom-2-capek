import { Button } from '@/components/ui/button.tsx';
import { Box, Diamond, FolderOpen, Package2, Save } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip.tsx';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';

export const PerspectiveSelector = () => {
  return (
    <div>
      <h3 className={'text-md font-bold'}>Projection</h3>
      <div className={'flex gap-x-2'}>
        <ToggleGroup type="single">
          <ToggleGroupItem value="Ortographic">
            <Tooltip>
              <TooltipTrigger asChild>
                <Box />
              </TooltipTrigger>
              <TooltipContent>
                <p>Orthographic Projection</p>
              </TooltipContent>
            </Tooltip>
          </ToggleGroupItem>
          <ToggleGroupItem value="Oblique">
            <Tooltip>
              <TooltipTrigger asChild>
                <Diamond />
              </TooltipTrigger>
              <TooltipContent>
                <p>Oblique Projection</p>
              </TooltipContent>
            </Tooltip>
          </ToggleGroupItem>
          <ToggleGroupItem value="Perspective">
            <Tooltip>
              <TooltipTrigger asChild>
                <Package2 />
              </TooltipTrigger>
              <TooltipContent>
                <p>Perspective Projection</p>
              </TooltipContent>
            </Tooltip>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};
