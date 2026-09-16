import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface NodeShellProps {
  selected: boolean;
  children: ReactNode;
}

export default function NodeShell({ selected, children }: NodeShellProps) {
  return (
    <div
      className={cn(
        'flex h-[80px] w-[120px] flex-col items-center justify-center gap-1 rounded-lg border bg-panel-bg transition-[border-color,box-shadow] duration-150',
        selected ? 'border-accent shadow-[0_0_0_2px_rgba(59,130,246,0.3)]' : 'border-panel-border',
      )}
    >
      {children}
    </div>
  );
}
