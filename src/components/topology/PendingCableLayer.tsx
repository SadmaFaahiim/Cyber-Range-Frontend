import { useReactFlow, useViewport } from '@xyflow/react';
import { useEffect, useRef } from 'react';

import { MIN_CABLE_LENGTH, PORT_SNAP_RADIUS } from '@/data/infrastructure-components';
import { getHandleFlowPosition, PORT_SIDES } from '@/lib/ports';
import { clampMinDistance } from '@/lib/utils';
import useCyberRangeStore from '@/store/cyberRangeStore';
import type { CableAnchor, NodePosition } from '@/types/topology';

// The Build window never shows red/green connection-status coloring — that's
// reserved for the Ready window's launch summary (see CableEdge.tsx). A cable
// being placed or still in progress is just the same neutral cable color as
// a connected one; only the small drag handles use the accent color so
// they stay visually discoverable as grabbable controls.
const CABLE_COLOR = 'var(--color-foreground)';
const HANDLE_COLOR = 'var(--color-accent)';

interface PendingCableLayerProps {
  onEndpointDrop: (end: 'start' | 'end', anchor: CableAnchor | null, position: NodePosition) => void;
}

export default function PendingCableLayer({ onEndpointDrop }: PendingCableLayerProps) {
  const pendingCable = useCyberRangeStore((state) => state.pendingCable);
  const updatePendingCableEnd = useCyberRangeStore((state) => state.updatePendingCableEnd);
  const cancelPendingCable = useCyberRangeStore((state) => state.cancelPendingCable);
  const { x: viewportX, y: viewportY, zoom } = useViewport();
  const instance = useReactFlow();
  const draggingEnd = useRef<'start' | 'end' | null>(null);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const end = draggingEnd.current;
      const current = useCyberRangeStore.getState().pendingCable;
      if (!end || !current) {
        return;
      }
      const flowPoint = instance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const anchorPoint = end === 'start' ? current.end : current.start;
      updatePendingCableEnd(end, clampMinDistance(flowPoint, anchorPoint, MIN_CABLE_LENGTH));
    }

    function handlePointerUp(event: PointerEvent) {
      const end = draggingEnd.current;
      draggingEnd.current = null;
      const current = useCyberRangeStore.getState().pendingCable;
      if (!end || !current) {
        return;
      }
      const flowPoint = instance.screenToFlowPosition({ x: event.clientX, y: event.clientY });

      // Geometric nearest-port snap: pixel-precise DOM hit-testing against the tiny
      // handle dots is unreliable (they sit right at a node's edge, under our own
      // dragged element, and their pointer-events state depends on RF's internals),
      // so instead we find the closest port within a generous snap radius.
      let closest: { nodeId: string; side: (typeof PORT_SIDES)[number]; distance: number } | null = null;
      for (const node of instance.getNodes()) {
        for (const side of PORT_SIDES) {
          const portPoint = getHandleFlowPosition(node, side);
          const distance = Math.hypot(portPoint.x - flowPoint.x, portPoint.y - flowPoint.y);
          if (distance <= PORT_SNAP_RADIUS && (!closest || distance < closest.distance)) {
            closest = { nodeId: node.id, side, distance };
          }
        }
      }

      if (closest) {
        onEndpointDrop(end, { nodeId: closest.nodeId, side: closest.side }, flowPoint);
      } else {
        onEndpointDrop(end, null, flowPoint);
      }
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [instance, updatePendingCableEnd, onEndpointDrop]);

  if (!pendingCable) {
    return null;
  }

  const resolveEnd = (anchor: CableAnchor | null, fallback: NodePosition): NodePosition => {
    if (!anchor) {
      return fallback;
    }
    const node = instance.getNode(anchor.nodeId);
    return node ? getHandleFlowPosition(node, anchor.side) : fallback;
  };

  const start = resolveEnd(pendingCable.startAnchor, pendingCable.start);
  const end = resolveEnd(pendingCable.endAnchor, pendingCable.end);
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
      aria-label="In-progress cable"
      role="img"
    >
      <title>In-progress cable</title>
      <g transform={`translate(${viewportX}, ${viewportY}) scale(${zoom})`}>
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          className="cable-flow"
          style={{ stroke: CABLE_COLOR, strokeWidth: 2, strokeDasharray: '6 3' }}
        />
        <circle
          cx={start.x}
          cy={start.y}
          r={7}
          className="pointer-events-auto cursor-grab"
          style={{ fill: 'white', stroke: HANDLE_COLOR, strokeWidth: 2 }}
          onPointerDown={(event) => {
            event.stopPropagation();
            draggingEnd.current = 'start';
          }}
        />
        <circle
          cx={end.x}
          cy={end.y}
          r={7}
          className="pointer-events-auto cursor-grab"
          style={{ fill: 'white', stroke: HANDLE_COLOR, strokeWidth: 2 }}
          onPointerDown={(event) => {
            event.stopPropagation();
            draggingEnd.current = 'end';
          }}
        />
        <foreignObject x={midX - 10} y={midY - 10} width={20} height={20} className="pointer-events-auto">
          <button
            type="button"
            onClick={cancelPendingCable}
            aria-label="Remove cable"
            className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300/80 bg-white/90 text-xs text-slate-500 transition-colors hover:border-accent hover:text-accent"
          >
            ✕
          </button>
        </foreignObject>
      </g>
    </svg>
  );
}
