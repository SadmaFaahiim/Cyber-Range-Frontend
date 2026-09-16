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
    <aside className="flex h-full w-[220px] shrink-0 flex-col gap-3 overflow-y-auto border-r border-panel-border bg-panel-bg p-4">
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
            className="flex cursor-grab flex-col items-start gap-1.5 rounded-md border border-panel-border bg-app-bg p-3 text-left transition-colors hover:border-accent"
          >
            <span className="flex items-center gap-2">
              <Icon className="text-accent" size={16} aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">{component.label}</span>
            </span>
            <span className="text-xs text-muted-foreground">{component.description}</span>
            <span className="text-[10px] text-muted-foreground/70">{APP_STRINGS.PALETTE.DRAG_HINT}</span>
          </button>
        );
      })}
    </aside>
  );
}
