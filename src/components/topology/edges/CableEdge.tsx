import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath } from '@xyflow/react';
import { memo } from 'react';

import useCyberRangeStore from '@/store/cyberRangeStore';

function CableEdgeComponent({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }: EdgeProps) {
  const removeEdge = useCyberRangeStore((state) => state.removeEdge);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        className="cable-flow"
        style={{
          stroke: 'var(--color-accent)',
          strokeWidth: 2,
          strokeDasharray: '6 3',
        }}
        markerEnd=""
      />
      <EdgeLabelRenderer>
        <button
          type="button"
          onClick={() => removeEdge(id)}
          className="nodrag nopan flex h-5 w-5 items-center justify-center rounded-full border border-panel-border bg-panel-bg text-xs text-muted-foreground transition-colors hover:border-warning hover:text-warning"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          aria-label={`Remove cable ${id}`}
        >
          ✕
        </button>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(CableEdgeComponent);
