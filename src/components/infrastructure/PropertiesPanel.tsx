import type { ChangeEvent } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { INFRASTRUCTURE_COMPONENTS } from '@/data/infrastructure-components';
import { APP_STRINGS } from '@/lib/strings';
import useCyberRangeStore from '@/store/cyberRangeStore';

export default function PropertiesPanel() {
  const selectedNodeId = useCyberRangeStore((state) => state.selectedNodeId);
  const canvasNodes = useCyberRangeStore((state) => state.canvasNodes);
  const canvasEdges = useCyberRangeStore((state) => state.canvasEdges);
  const updateNodeLabel = useCyberRangeStore((state) => state.updateNodeLabel);
  const removeNode = useCyberRangeStore((state) => state.removeNode);
  const selectNode = useCyberRangeStore((state) => state.selectNode);

  const node = canvasNodes.find((item) => item.id === selectedNodeId);

  if (!node) {
    return (
      <aside className="flex h-full w-[220px] shrink-0 items-center justify-center border-l border-panel-border bg-panel-bg p-4">
        <p className="text-center text-sm text-muted-foreground">{APP_STRINGS.PROPERTIES.EMPTY}</p>
      </aside>
    );
  }

  const component = INFRASTRUCTURE_COMPONENTS.find((item) => item.type === node.data.type);

  const connections = canvasEdges
    .filter((edge) => edge.source === node.id || edge.target === node.id)
    .map((edge) => {
      const otherId = edge.source === node.id ? edge.target : edge.source;
      const other = canvasNodes.find((item) => item.id === otherId);
      return other?.data.label ?? otherId;
    });

  const handleDelete = () => {
    removeNode(node.id);
    selectNode(null);
  };

  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateNodeLabel(node.id, event.target.value);
  };

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-panel-border bg-panel-bg p-4">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {APP_STRINGS.PROPERTIES.TITLE}
        </h2>
        <div>
          <Badge variant="default">{component?.label ?? node.data.type}</Badge>
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">{APP_STRINGS.PROPERTIES.NAME}</span>
        <input
          value={node.data.label}
          onChange={handleLabelChange}
          className="h-8 w-full rounded-md border border-panel-border bg-app-bg px-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">{APP_STRINGS.PROPERTIES.CONNECTIONS}</span>
        {connections.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {connections.map((label) => (
              <li
                key={label}
                className="rounded border border-panel-border bg-app-bg px-2 py-1 font-mono text-xs text-foreground"
              >
                {label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground">{APP_STRINGS.PROPERTIES.NO_CONNECTIONS}</p>
        )}
      </div>

      <Button variant="destructive" size="sm" onClick={handleDelete}>
        {APP_STRINGS.PROPERTIES.DELETE}
      </Button>
    </aside>
  );
}
