import {
  addEdge,
  Background,
  BackgroundVariant,
  type Connection,
  Controls,
  MiniMap,
  type NodeChange,
  type OnConnect,
  type OnReconnect,
  ReactFlow,
  type ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { type DragEvent, type MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef } from 'react';
import { edgeTypes, nodeTypes } from '@/components/topology/flowTypes';
import { sourceHandleId, targetHandleId } from '@/components/topology/nodes/shared/NodePorts';
import PendingCableLayer from '@/components/topology/PendingCableLayer';
import {
  DEFAULT_NODE_SIZE,
  INFRASTRUCTURE_COMPONENTS,
  MIN_CABLE_LENGTH,
  SNAP_GRID,
} from '@/data/infrastructure-components';
import { getHandleFlowPosition } from '@/lib/ports';
import { APP_STRINGS } from '@/lib/strings';
import { formatNodeId } from '@/lib/utils';
import { MIN_PC_DISTANCE, validateReadiness } from '@/lib/validation';
import useCyberRangeStore from '@/store/cyberRangeStore';
import type {
  CableAnchor,
  NodePosition,
  PortSide,
  TopologyEdge,
  TopologyNode,
  TopologyNodeType,
} from '@/types/topology';

export default function InfrastructureCanvas() {
  const canvasNodes = useCyberRangeStore((state) => state.canvasNodes);
  const canvasEdges = useCyberRangeStore((state) => state.canvasEdges);
  const placeNode = useCyberRangeStore((state) => state.placeNode);
  const connectNodes = useCyberRangeStore((state) => state.connectNodes);
  const removeEdge = useCyberRangeStore((state) => state.removeEdge);
  const selectNode = useCyberRangeStore((state) => state.selectNode);
  const selectEdge = useCyberRangeStore((state) => state.selectEdge);
  const updateNodePosition = useCyberRangeStore((state) => state.updateNodePosition);
  const updateReadiness = useCyberRangeStore((state) => state.updateReadiness);
  const startPendingCable = useCyberRangeStore((state) => state.startPendingCable);
  const updatePendingCableEnd = useCyberRangeStore((state) => state.updatePendingCableEnd);
  const setPendingCableAnchor = useCyberRangeStore((state) => state.setPendingCableAnchor);
  const cancelPendingCable = useCyberRangeStore((state) => state.cancelPendingCable);

  const [localNodes, setLocalNodes, onNodesChange] = useNodesState<TopologyNode>(canvasNodes);
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState<TopologyEdge>(canvasEdges);

  const reactFlowRef = useRef<ReactFlowInstance<TopologyNode, TopologyEdge> | null>(null);

  useEffect(() => {
    setLocalNodes(canvasNodes);
  }, [canvasNodes, setLocalNodes]);

  useEffect(() => {
    setLocalEdges(canvasEdges);
  }, [canvasEdges, setLocalEdges]);

  useEffect(() => {
    updateReadiness(validateReadiness(canvasNodes, canvasEdges));
  }, [canvasNodes, canvasEdges, updateReadiness]);

  const clampPcPosition = useCallback(
    (nodeId: string, proposed: NodePosition): NodePosition => {
      let position = proposed;
      for (const other of localNodes) {
        if (other.id === nodeId || other.type !== 'pc') {
          continue;
        }
        const dx = position.x - other.position.x;
        const dy = position.y - other.position.y;
        const distance = Math.hypot(dx, dy);
        if (distance < MIN_PC_DISTANCE) {
          const scale = distance === 0 ? 1 : MIN_PC_DISTANCE / distance;
          const angle = distance === 0 ? Math.random() * Math.PI * 2 : Math.atan2(dy, dx);
          position =
            distance === 0
              ? {
                  x: other.position.x + Math.cos(angle) * MIN_PC_DISTANCE,
                  y: other.position.y + Math.sin(angle) * MIN_PC_DISTANCE,
                }
              : { x: other.position.x + dx * scale, y: other.position.y + dy * scale };
        }
      }
      return position;
    },
    [localNodes],
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange<TopologyNode>[]) => {
      const adjusted = changes.map((change) => {
        if (change.type !== 'position' || !change.position) {
          return change;
        }
        const node = localNodes.find((item) => item.id === change.id);
        if (node?.type !== 'pc') {
          return change;
        }
        return { ...change, position: clampPcPosition(change.id, change.position) };
      });

      onNodesChange(adjusted);
      for (const change of adjusted) {
        if (change.type === 'position' && change.position && !change.dragging) {
          updateNodePosition(change.id, change.position);
        }
      }
    },
    [onNodesChange, updateNodePosition, localNodes, clampPcPosition],
  );

  const handleConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) {
        return;
      }
      const edge: TopologyEdge = {
        id: formatNodeId('edge'),
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        type: 'cable',
      };
      setLocalEdges((previous) => addEdge(edge, previous));
      connectNodes(edge);
    },
    [connectNodes, setLocalEdges],
  );

  const handleReconnect: OnReconnect<TopologyEdge> = useCallback(
    (oldEdge, newConnection) => {
      if (!newConnection.source || !newConnection.target) {
        return;
      }
      setLocalEdges((previous) => {
        const next = previous.filter((edge) => edge.id !== oldEdge.id);
        return addEdge(
          {
            ...oldEdge,
            source: newConnection.source,
            target: newConnection.target,
            sourceHandle: newConnection.sourceHandle,
            targetHandle: newConnection.targetHandle,
          },
          next,
        );
      });
      removeEdge(oldEdge.id);
      connectNodes({
        ...oldEdge,
        source: newConnection.source,
        target: newConnection.target,
        sourceHandle: newConnection.sourceHandle,
        targetHandle: newConnection.targetHandle,
      });
    },
    [connectNodes, removeEdge, setLocalEdges],
  );

  const reconnectSucceeded = useRef(false);

  const handleReconnectStart = useCallback(() => {
    reconnectSucceeded.current = false;
  }, []);

  const handleReconnectSuccess: OnReconnect<TopologyEdge> = useCallback(
    (oldEdge, newConnection) => {
      reconnectSucceeded.current = true;
      handleReconnect(oldEdge, newConnection);
    },
    [handleReconnect],
  );

  const handleReconnectEnd = useCallback(
    (_event: MouseEvent | TouchEvent, edge: TopologyEdge, handleType: 'source' | 'target') => {
      if (reconnectSucceeded.current) {
        return;
      }
      const instance = reactFlowRef.current;
      if (!instance) {
        return;
      }
      const survivingNodeId = handleType === 'source' ? edge.target : edge.source;
      const survivingHandle = handleType === 'source' ? edge.targetHandle : edge.sourceHandle;
      const survivingSide = (survivingHandle?.replace(/-source$|-target$/, '') ?? 'top') as PortSide;
      const survivingNode = instance.getNode(survivingNodeId);
      if (!survivingNode) {
        return;
      }
      const anchorPoint = getHandleFlowPosition(survivingNode, survivingSide);
      const freePoint =
        handleType === 'source'
          ? { x: anchorPoint.x - MIN_CABLE_LENGTH, y: anchorPoint.y }
          : { x: anchorPoint.x + MIN_CABLE_LENGTH, y: anchorPoint.y };

      removeEdge(edge.id);
      setLocalEdges((previous) => previous.filter((item) => item.id !== edge.id));

      const survivingAnchor: CableAnchor = { nodeId: survivingNodeId, side: survivingSide };
      if (handleType === 'source') {
        startPendingCable(freePoint, anchorPoint, null, survivingAnchor);
      } else {
        startPendingCable(anchorPoint, freePoint, survivingAnchor, null);
      }
    },
    [removeEdge, setLocalEdges, startPendingCable],
  );

  const handleNodeClick = useCallback(
    (_event: ReactMouseEvent, node: TopologyNode) => {
      selectNode(node.id);
    },
    [selectNode],
  );

  const handleEdgeClick = useCallback(
    (_event: ReactMouseEvent, edge: TopologyEdge) => {
      selectEdge(edge.id);
    },
    [selectEdge],
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow') as TopologyNodeType | 'cable';
      const instance = reactFlowRef.current;
      if (!instance) {
        return;
      }

      const position = instance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (type === 'cable') {
        startPendingCable(position, { x: position.x + MIN_CABLE_LENGTH, y: position.y });
        return;
      }
      if (type !== 'pc' && type !== 'router') {
        return;
      }
      const component = INFRASTRUCTURE_COMPONENTS.find((item) => item.type === type);

      const node: TopologyNode = {
        id: formatNodeId(type),
        type,
        position,
        data: {
          label: component?.defaultName ?? type,
          type,
          nodeType: type,
          ...(type === 'pc' ? { operatingSystem: null } : {}),
        },
        width: DEFAULT_NODE_SIZE.width,
        height: DEFAULT_NODE_SIZE.height,
      };
      placeNode(node);
    },
    [placeNode, startPendingCable],
  );

  const handlePendingCableEndpointDrop = useCallback(
    (end: 'start' | 'end', anchor: CableAnchor | null, position: NodePosition) => {
      const current = useCyberRangeStore.getState().pendingCable;
      if (!current) {
        return;
      }
      const startAnchor = end === 'start' ? anchor : current.startAnchor;
      const endAnchor = end === 'end' ? anchor : current.endAnchor;

      if (startAnchor && endAnchor && startAnchor.nodeId !== endAnchor.nodeId) {
        const edge: TopologyEdge = {
          id: formatNodeId('edge'),
          source: startAnchor.nodeId,
          sourceHandle: sourceHandleId(startAnchor.side),
          target: endAnchor.nodeId,
          targetHandle: targetHandleId(endAnchor.side),
          type: 'cable',
        };
        setLocalEdges((previous) => addEdge(edge, previous));
        connectNodes(edge);
        cancelPendingCable();
        return;
      }

      setPendingCableAnchor(end, anchor);
      updatePendingCableEnd(end, position);
    },
    [connectNodes, cancelPendingCable, setPendingCableAnchor, updatePendingCableEnd, setLocalEdges],
  );

  return (
    <section
      aria-label={APP_STRINGS.CANVAS.EMPTY_TITLE}
      className="canvas-dot-grid relative h-full min-w-0 flex-1 bg-canvas-bg"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <ReactFlow<TopologyNode, TopologyEdge>
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        onReconnectStart={handleReconnectStart}
        onReconnect={handleReconnectSuccess}
        onReconnectEnd={handleReconnectEnd}
        edgesReconnectable
        onInit={(instance) => {
          reactFlowRef.current = instance;
        }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={false}
        minZoom={0.3}
        maxZoom={2}
        snapToGrid
        snapGrid={SNAP_GRID}
        deleteKeyCode={null}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(14, 165, 233, 0.15)" />
        <Controls />
        <MiniMap
          pannable
          zoomable
          bgColor="var(--color-panel-bg)"
          nodeColor="var(--color-accent)"
          maskColor="var(--color-panel-bg)"
          className="dark:opacity-80"
        />
        <PendingCableLayer onEndpointDrop={handlePendingCableEndpointDrop} />
      </ReactFlow>

      {canvasNodes.length === 0 ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
          <span className="text-lg font-semibold text-foreground">{APP_STRINGS.CANVAS.EMPTY_TITLE}</span>
          <span className="max-w-sm text-center text-sm text-muted-foreground">{APP_STRINGS.CANVAS.EMPTY_DESC}</span>
        </div>
      ) : null}
    </section>
  );
}
