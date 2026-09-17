import type { NodeProps } from '@xyflow/react';
import { ChevronDown, ChevronUp, Monitor } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import useCyberRangeStore from '@/store/cyberRangeStore';
import { getOsFamily, OPERATING_SYSTEMS, type OperatingSystem } from '@/types/pc';
import type { TopologyNode } from '@/types/topology';

import LinuxLogo from './os-icons/LinuxLogo';
import WindowsLogo from './os-icons/WindowsLogo';
import NodePorts from './shared/NodePorts';
import NodeShell from './shared/NodeShell';

function PCNodeComponent({ data, selected, id }: NodeProps<TopologyNode>) {
  const pendingCable = useCyberRangeStore((state) => state.pendingCable);
  const setPcOperatingSystem = useCyberRangeStore((state) => state.setPcOperatingSystem);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isCableAnchor = pendingCable?.startAnchor?.nodeId === id || pendingCable?.endAnchor?.nodeId === id;
  const operatingSystem = data.operatingSystem ?? null;
  const family = getOsFamily(operatingSystem);

  useEffect(() => {
    if (!open) {
      return;
    }
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  const handleSelect = (os: OperatingSystem) => {
    setPcOperatingSystem(id, os);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <NodePorts />
      <NodeShell selected={selected || isCableAnchor}>
        {family === 'windows' ? (
          <WindowsLogo className="text-accent" size={20} />
        ) : family === 'linux' ? (
          <LinuxLogo className="text-accent" size={20} />
        ) : (
          <Monitor className="text-accent" size={22} aria-hidden="true" />
        )}
        <span className="font-mono text-xs text-muted-foreground">{data.label}</span>
      </NodeShell>

      <button
        type="button"
        className="nodrag nopan absolute -right-2.5 -top-2.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/90 bg-white/90 text-slate-500 shadow-[0_2px_6px_var(--glass-shadow)] transition-colors hover:text-accent dark:border-panel-border dark:bg-[rgba(23,28,42,0.9)] dark:text-slate-300"
        onClick={() => setOpen((value) => !value)}
        aria-label={operatingSystem ? `Change operating system (${operatingSystem})` : 'Choose operating system'}
        aria-expanded={open}
      >
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open ? (
        <ul className="nodrag nopan absolute right-[-8px] top-[calc(100%+6px)] z-10 w-40 overflow-hidden rounded-md border border-white/90 bg-white/95 py-1 shadow-[0_8px_20px_var(--glass-shadow)] backdrop-blur-[8px] dark:border-panel-border dark:bg-[rgba(23,28,42,0.95)]">
          {OPERATING_SYSTEMS.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => handleSelect(option.id)}
                className={cn(
                  'flex w-full items-center px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-accent/10 dark:text-slate-200',
                  operatingSystem === option.id && 'font-medium text-accent',
                )}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default memo(PCNodeComponent);
