import type { ChangeEvent } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { INFRASTRUCTURE_COMPONENTS } from '@/data/infrastructure-components';
import { APP_STRINGS } from '@/lib/strings';
import { cn } from '@/lib/utils';
import useCyberRangeStore from '@/store/cyberRangeStore';
import { OPERATING_SYSTEMS } from '@/types/pc';
import type { PortSide } from '@/types/topology';

function portSide(handleId: string | null | undefined): PortSide | null {
  if (!handleId) {
    return null;
  }
  const side = handleId.replace(/-source$|-target$/, '');
  return side as PortSide;
}

export default function PropertiesPanel() {
  const selectedNodeId = useCyberRangeStore((state) => state.selectedNodeId);
  const selectedEdgeId = useCyberRangeStore((state) => state.selectedEdgeId);
  const canvasNodes = useCyberRangeStore((state) => state.canvasNodes);
  const canvasEdges = useCyberRangeStore((state) => state.canvasEdges);
  const updateNodeLabel = useCyberRangeStore((state) => state.updateNodeLabel);
  const removeNode = useCyberRangeStore((state) => state.removeNode);
  const removeEdge = useCyberRangeStore((state) => state.removeEdge);
  const selectNode = useCyberRangeStore((state) => state.selectNode);
  const selectEdge = useCyberRangeStore((state) => state.selectEdge);

  const shellClass =
    'flex h-full w-[220px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-panel-border bg-panel-bg p-4 shadow-[-2px_0_12px_var(--glass-shadow)] backdrop-blur-[12px]';

  const edge = selectedEdgeId ? canvasEdges.find((item) => item.id === selectedEdgeId) : undefined;

  if (edge) {
    const sourceNode = canvasNodes.find((item) => item.id === edge.source);
    const targetNode = canvasNodes.find((item) => item.id === edge.target);
    const sourceSide = portSide(edge.sourceHandle);
    const targetSide = portSide(edge.targetHandle);

    const handleDeleteCable = () => {
      removeEdge(edge.id);
      selectEdge(null);
    };

    return (
      <aside className={shellClass}>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {APP_STRINGS.PROPERTIES.TITLE}
          </h2>
          <div>
            <Badge variant="default">{APP_STRINGS.PROPERTIES.CABLE_LABEL}</Badge>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
            {APP_STRINGS.PROPERTIES.SOURCE}
          </span>
          <p className="rounded border border-white/90 bg-white/80 px-2 py-1 font-mono text-xs text-slate-700 dark:border-panel-border dark:bg-[rgba(23,28,42,0.72)] dark:text-slate-200">
            {sourceNode?.data.label ?? edge.source}
            {sourceSide ? ` · ${sourceSide}` : ''}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
            {APP_STRINGS.PROPERTIES.DESTINATION}
          </span>
          <p className="rounded border border-white/90 bg-white/80 px-2 py-1 font-mono text-xs text-slate-700 dark:border-panel-border dark:bg-[rgba(23,28,42,0.72)] dark:text-slate-200">
            {targetNode?.data.label ?? edge.target}
            {targetSide ? ` · ${targetSide}` : ''}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
            {APP_STRINGS.PROPERTIES.STATUS}
          </span>
          <div>
            <Badge variant="success">{APP_STRINGS.PROPERTIES.CONNECTED}</Badge>
          </div>
        </div>

        <Button variant="destructive" size="sm" onClick={handleDeleteCable}>
          {APP_STRINGS.PROPERTIES.DELETE_CABLE}
        </Button>
      </aside>
    );
  }

  const node = canvasNodes.find((item) => item.id === selectedNodeId);

  if (!node) {
    return (
      <aside className={cn(shellClass, 'items-center justify-center')}>
        <p className="text-center text-sm text-muted-foreground">{APP_STRINGS.PROPERTIES.EMPTY}</p>
      </aside>
    );
  }

  const component = INFRASTRUCTURE_COMPONENTS.find((item) => item.type === node.data.type);
  const isPc = node.data.type === 'pc';
  const osLabel = OPERATING_SYSTEMS.find((option) => option.id === node.data.operatingSystem)?.label;

  const connections = canvasEdges
    .filter((item) => item.source === node.id || item.target === node.id)
    .map((item) => {
      const isSource = item.source === node.id;
      const otherId = isSource ? item.target : item.source;
      const other = canvasNodes.find((candidate) => candidate.id === otherId);
      const mySide = portSide(isSource ? item.sourceHandle : item.targetHandle);
      return { id: item.id, label: other?.data.label ?? otherId, side: mySide };
    });

  const handleDelete = () => {
    removeNode(node.id);
    selectNode(null);
  };

  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateNodeLabel(node.id, event.target.value);
  };

  return (
    <aside className={shellClass}>
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {APP_STRINGS.PROPERTIES.TITLE}
        </h2>
        <div>
          <Badge variant="default">{component?.label ?? node.data.type}</Badge>
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{APP_STRINGS.PROPERTIES.NAME}</span>
        <input
          value={node.data.label}
          onChange={handleLabelChange}
          className="h-8 w-full rounded-md border border-white/90 bg-white/80 px-2 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-panel-border dark:bg-[rgba(23,28,42,0.72)]"
        />
      </label>

      {isPc ? (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
            {APP_STRINGS.PROPERTIES.OPERATING_SYSTEM}
          </span>
          <p className="text-sm text-foreground">{osLabel ?? APP_STRINGS.PROPERTIES.OS_NOT_SET}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
          {APP_STRINGS.PROPERTIES.CONNECTIONS}
        </span>
        {connections.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {connections.map((connection) => (
              <li
                key={connection.id}
                className="rounded border border-white/90 bg-white/80 px-2 py-1 font-mono text-xs text-slate-700 dark:border-panel-border dark:bg-[rgba(23,28,42,0.72)] dark:text-slate-200"
              >
                {connection.label}
                {connection.side ? ` · ${connection.side}` : ''}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400">{APP_STRINGS.PROPERTIES.NO_CONNECTIONS}</p>
        )}
      </div>

      <Button variant="destructive" size="sm" onClick={handleDelete}>
        {APP_STRINGS.PROPERTIES.DELETE}
      </Button>
    </aside>
  );
}
