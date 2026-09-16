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
        'flex h-[80px] w-[120px] flex-col items-center justify-center gap-1 rounded-[10px] border border-white/90 bg-white/65 shadow-[0_4px_16px_var(--glass-shadow)] backdrop-blur-[8px] transition-[border-color,box-shadow,transform] duration-150 hover:scale-[1.03] hover:shadow-[0_0_0_2px_rgba(14,165,233,0.3),0_4px_16px_var(--glass-shadow)]',
        selected
          ? 'border-accent shadow-[0_0_0_2px_rgba(14,165,233,0.35),0_4px_16px_var(--glass-shadow)]'
          : 'dark:border-panel-border dark:bg-[rgba(23,28,42,0.72)]',
      )}
    >
      {children}
    </div>
  );
}
