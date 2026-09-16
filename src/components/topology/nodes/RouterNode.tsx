import { Handle, type NodeProps, Position } from '@xyflow/react';
import { Network } from 'lucide-react';
import { memo } from 'react';

import type { TopologyNode } from '@/types/topology';

import NodeShell from './shared/NodeShell';

function RouterNodeComponent({ data, selected }: NodeProps<TopologyNode>) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <NodeShell selected={selected ?? false}>
        <Network className="text-accent" size={22} aria-hidden="true" />
        <span className="font-mono text-xs text-muted-foreground">{data.label}</span>
      </NodeShell>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export default memo(RouterNodeComponent);
