import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath } from '@xyflow/react';
import { memo } from 'react';

import { isSignalOk } from '@/lib/validation';
import useCyberRangeStore from '@/store/cyberRangeStore';
import type { TopologyEdge } from '@/types/topology';

// Build window: a cable rendered as a real edge is always fully connected
// (see PendingCableLayer for the not-yet-connected, red state), so it's just
// the app's neutral foreground color there. The Ready window's launch
// summary tags its preview edges with data.readinessPreview to opt into
// red/green connection-status coloring instead.
const BUILD_COLOR = 'var(--color-foreground)';
const SIGNAL_OK = '#22c55e';
const SIGNAL_WARN = '#ef4444';

function CableEdgeComponent({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
}: EdgeProps<TopologyEdge>) {
  const removeEdge = useCyberRangeStore((s) => s.removeEdge);
  const canvasNodes = useCyberRangeStore((s) => s.canvasNodes);

  const strokeColor = data?.readinessPreview
    ? isSignalOk(source, target, canvasNodes)
      ? SIGNAL_OK
      : SIGNAL_WARN
    : BUILD_COLOR;

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
          strokeWidth: selected ? 3 : 2,
          strokeDasharray: '6 3',
          filter: selected ? 'drop-shadow(0 0 3px var(--color-accent))' : undefined,
          ['--edge-color' as string]: strokeColor,
        }}
        markerEnd=""
      />
      {selected ? (
        <EdgeLabelRenderer>
          <button
            type="button"
            onClick={() => removeEdge(id)}
            className="nodrag nopan pointer-events-auto flex h-5 w-5 items-center justify-center rounded-full border border-slate-300/80 bg-white/80 text-xs text-slate-500 transition-colors hover:border-accent hover:text-accent dark:border-slate-600/80 dark:bg-[rgba(23,28,42,0.85)] dark:text-slate-300"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
            aria-label={`Remove cable ${id}`}
          >
            ✕
          </button>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}

export default memo(CableEdgeComponent);
