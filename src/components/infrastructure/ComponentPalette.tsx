import { Monitor, Network } from 'lucide-react';
import type { ComponentType, DragEvent } from 'react';

import { INFRASTRUCTURE_COMPONENTS, type PaletteComponent } from '@/data/infrastructure-components';
import { APP_STRINGS } from '@/lib/strings';

type PaletteIcon = ComponentType<{ size?: number; className?: string }>;

function iconFor(iconName: string): PaletteIcon {
  switch (iconName) {
    case 'Monitor':
      return Monitor;
    case 'RouterIcon':
      return Network;
    default:
      return Monitor;
  }
}

export default function ComponentPalette() {
  const handleDragStart = (event: DragEvent<HTMLButtonElement>, type: PaletteComponent['type']) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col gap-3 overflow-y-auto border-r border-white/80 bg-white/55 p-4 shadow-[2px_0_12px_rgba(148,163,184,0.1)] backdrop-blur-[12px]">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {APP_STRINGS.PALETTE.TITLE}
      </h2>

      {INFRASTRUCTURE_COMPONENTS.map((component) => {
        const Icon = iconFor(component.icon);
        return (
          <button
            key={component.type}
            type="button"
            draggable
            onDragStart={(event) => handleDragStart(event, component.type)}
            className="flex cursor-grab flex-col items-start gap-1.5 rounded-md border border-slate-200/80 bg-white/70 p-3 text-left shadow-[0_2px_8px_rgba(148,163,184,0.1)] transition-colors hover:border-accent/60 hover:bg-white/90 hover:shadow-[0_4px_12px_rgba(14,165,233,0.15)]"
          >
            <span className="flex items-center gap-2">
              <Icon className="text-accent" size={16} aria-hidden="true" />
              <span className="text-sm font-medium text-slate-700">{component.label}</span>
            </span>
            <span className="text-xs text-slate-400">{component.description}</span>
            <span className="text-[10px] text-muted-foreground/70">{APP_STRINGS.PALETTE.DRAG_HINT}</span>
          </button>
        );
      })}
    </aside>
  );
}
