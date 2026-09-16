import { Handle, type NodeProps, Position } from '@xyflow/react';
import { Network } from 'lucide-react';
import { memo } from 'react';
import useCyberRangeStore from '@/store/cyberRangeStore';
import type { TopologyNode } from '@/types/topology';

import NodeShell from './shared/NodeShell';

function RouterNodeComponent({ data, selected, id }: NodeProps<TopologyNode>) {
  const cableSourceId = useCyberRangeStore((state) => state.cablePlacementSourceId);
  const isCableSource = id === cableSourceId;

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <NodeShell selected={selected || isCableSource}>
        <Network className="text-accent" size={22} aria-hidden="true" />
        <span className="font-mono text-xs text-muted-foreground">{data.label}</span>
      </NodeShell>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export default memo(RouterNodeComponent);
