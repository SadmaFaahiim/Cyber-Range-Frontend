import { Cable, Monitor } from 'lucide-react';
import type { ComponentType, DragEvent } from 'react';
import RouterLogo from '@/components/topology/nodes/shared/RouterLogo';
import { INFRASTRUCTURE_COMPONENTS, MIN_CABLE_LENGTH, type PaletteComponent } from '@/data/infrastructure-components';
import { APP_STRINGS } from '@/lib/strings';
import { cn } from '@/lib/utils';
import useCyberRangeStore from '@/store/cyberRangeStore';

type PaletteIcon = ComponentType<{ size?: number; className?: string }>;

const CABLE_DEFAULT_START = { x: 240, y: 200 };

function iconFor(iconName: string): PaletteIcon {
  switch (iconName) {
    case 'Monitor':
      return Monitor;
    case 'Cable':
      return Cable;
    default:
      return Monitor;
  }
}

export default function ComponentPalette() {
  const pendingCable = useCyberRangeStore((state) => state.pendingCable);
  const startPendingCable = useCyberRangeStore((state) => state.startPendingCable);

  const handleDragStart = (event: DragEvent<HTMLButtonElement>, type: PaletteComponent['type']) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleCableClick = () => {
    startPendingCable(CABLE_DEFAULT_START, { x: CABLE_DEFAULT_START.x + MIN_CABLE_LENGTH, y: CABLE_DEFAULT_START.y });
  };

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col gap-3 overflow-y-auto border-r border-panel-border bg-panel-bg p-4 shadow-[2px_0_12px_var(--glass-shadow)] backdrop-blur-[12px]">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {APP_STRINGS.PALETTE.TITLE}
      </h2>

      {INFRASTRUCTURE_COMPONENTS.map((component) => {
        const isCable = component.type === 'cable';
        const isRouter = component.type === 'router';
        const Icon = iconFor(component.icon);
        return (
          <button
            key={component.type}
            type="button"
            draggable
            onDragStart={(event) => handleDragStart(event, component.type)}
            onClick={() => {
              if (isCable) {
                handleCableClick();
              }
            }}
            data-active={isCable && pendingCable ? 'true' : undefined}
            className={cn(
              'flex cursor-grab flex-col items-start gap-1.5 rounded-md border border-white/80 bg-white/70 p-3 text-left shadow-[0_2px_8px_var(--glass-shadow)] transition-all hover:border-accent/60 hover:bg-white/90 hover:shadow-[0_4px_12px_rgba(14,165,233,0.15)] hover:scale-[1.02] dark:border-panel-border dark:bg-[rgba(23,28,42,0.72)] dark:hover:bg-[rgba(28,34,52,0.82)]',
              isCable &&
                pendingCable &&
                'border-accent bg-white/90 shadow-[0_4px_12px_rgba(14,165,233,0.2)] dark:bg-[rgba(28,34,52,0.9)]',
            )}
          >
            <span className="flex items-center gap-2">
              {isRouter ? <RouterLogo iconSize={13} /> : <Icon className="text-accent" size={16} aria-hidden="true" />}
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{component.label}</span>
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">{component.description}</span>
            <span className="text-[10px] text-muted-foreground/70">
              {isCable ? APP_STRINGS.PALETTE.CABLE_HINT : APP_STRINGS.PALETTE.DRAG_HINT}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
