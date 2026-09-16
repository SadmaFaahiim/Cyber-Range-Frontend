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
        'flex h-[80px] w-[120px] flex-col items-center justify-center gap-1 rounded-[10px] border border-white/90 bg-white/65 shadow-[0_4px_16px_rgba(148,163,184,0.18)] backdrop-blur-[8px] transition-[border-color,box-shadow] duration-150',
        selected
          ? 'border-accent shadow-[0_0_0_2px_rgba(14,165,233,0.25),0_4px_16px_rgba(148,163,184,0.18)]'
          : 'border-white/90',
      )}
    >
      {children}
    </div>
  );
}
