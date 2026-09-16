import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath } from '@xyflow/react';
import { memo } from 'react';

import useCyberRangeStore from '@/store/cyberRangeStore';

const SIGNAL_OK = '#22c55e';
const SIGNAL_WARN = '#ef4444';

function CableEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  source,
  target,
}: EdgeProps) {
  const removeEdge = useCyberRangeStore((s) => s.removeEdge);
  const canvasNodes = useCyberRangeStore((s) => s.canvasNodes);

  const sourceType = canvasNodes.find((n) => n.id === source)?.data.type;
  const targetType = canvasNodes.find((n) => n.id === target)?.data.type;
  const signalOk = !!sourceType && !!targetType && sourceType !== targetType;
  const strokeColor = signalOk ? SIGNAL_OK : SIGNAL_WARN;

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
          stroke: strokeColor,
          strokeWidth: 2,
          strokeDasharray: '6 3',
          ['--edge-color' as string]: strokeColor,
        }}
        markerEnd=""
      />
      <EdgeLabelRenderer>
        <button
          type="button"
          onClick={() => removeEdge(id)}
          className="nodrag nopan flex h-5 w-5 items-center justify-center rounded-full border border-slate-300/80 bg-white/80 text-xs text-slate-500 transition-colors hover:border-accent hover:text-accent dark:border-slate-600/80 dark:bg-[rgba(23,28,42,0.85)] dark:text-slate-300"
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
