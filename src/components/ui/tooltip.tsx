import {
  TooltipContent as TooltipContentPrimitive,
  Tooltip as TooltipPrimitive,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <TooltipPrimitive>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContentPrimitive
          sideOffset={6}
          className={cn(
            'rounded-md border border-panel-border bg-app-bg px-3 py-1.5 text-xs text-foreground shadow-lg z-50',
            'data-[state=delayed-open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95',
            className,
          )}
        >
          {content}
        </TooltipContentPrimitive>
      </TooltipPrimitive>
    </TooltipProvider>
  );
}
