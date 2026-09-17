import type { NodeProps } from '@xyflow/react';
import { memo } from 'react';
import useCyberRangeStore from '@/store/cyberRangeStore';
import type { TopologyNode } from '@/types/topology';

import NodePorts from './shared/NodePorts';
import NodeShell from './shared/NodeShell';
import RouterLogo from './shared/RouterLogo';

function RouterNodeComponent({ data, selected, id }: NodeProps<TopologyNode>) {
  const pendingCable = useCyberRangeStore((state) => state.pendingCable);
  const isCableAnchor = pendingCable?.startAnchor?.nodeId === id || pendingCable?.endAnchor?.nodeId === id;

  return (
    <>
      <NodePorts />
      <NodeShell selected={selected || isCableAnchor}>
        <RouterLogo iconSize={16} />
        <span className="font-mono text-xs text-muted-foreground">{data.label}</span>
      </NodeShell>
    </>
  );
}

export default memo(RouterNodeComponent);
