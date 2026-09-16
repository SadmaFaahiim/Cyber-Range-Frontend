import {
  addEdge,
  Background,
  BackgroundVariant,
  type Connection,
  Controls,
  type EdgeTypes,
  MiniMap,
  type NodeChange,
  type NodeTypes,
  type OnConnect,
  ReactFlow,
  type ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { type DragEvent, type MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef } from 'react';

import CableEdge from '@/components/topology/edges/CableEdge';
import PCNode from '@/components/topology/nodes/PCNode';
import RouterNode from '@/components/topology/nodes/RouterNode';
import { DEFAULT_NODE_SIZE, INFRASTRUCTURE_COMPONENTS, SNAP_GRID } from '@/data/infrastructure-components';
import { formatNodeId } from '@/lib/node-utils';
import { APP_STRINGS } from '@/lib/strings';
import { validateReadiness } from '@/lib/validation';
import useCyberRangeStore from '@/store/cyberRangeStore';
import type { TopologyEdge, TopologyNode, TopologyNodeType } from '@/types/topology';

const nodeTypes = { pc: PCNode, router: RouterNode } satisfies NodeTypes;
const edgeTypes = { cable: CableEdge } satisfies EdgeTypes;

export default function InfrastructureCanvas() {
  const canvasNodes = useCyberRangeStore((state) => state.canvasNodes);
  const canvasEdges = useCyberRangeStore((state) => state.canvasEdges);
  const placeNode = useCyberRangeStore((state) => state.placeNode);
  const connectNodes = useCyberRangeStore((state) => state.connectNodes);
  const selectNode = useCyberRangeStore((state) => state.selectNode);
  const updateNodePosition = useCyberRangeStore((state) => state.updateNodePosition);
  const updateReadiness = useCyberRangeStore((state) => state.updateReadiness);

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

  const handleNodesChange = useCallback(
    (changes: NodeChange<TopologyNode>[]) => {
      onNodesChange(changes);
      for (const change of changes) {
        if (change.type === 'position' && change.position && !change.dragging) {
          updateNodePosition(change.id, change.position);
        }
      }
    },
    [onNodesChange, updateNodePosition],
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
        type: 'cable',
      };
      setLocalEdges((previous) => addEdge(edge, previous));
      connectNodes(edge);
    },
    [connectNodes, setLocalEdges],
  );

  const handleNodeClick = useCallback(
    (_event: ReactMouseEvent, node: TopologyNode) => {
      selectNode(node.id);
    },
    [selectNode],
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow') as TopologyNodeType;
      if (type !== 'pc' && type !== 'router') {
        return;
      }
      const instance = reactFlowRef.current;
      if (!instance) {
        return;
      }

      const position = instance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const component = INFRASTRUCTURE_COMPONENTS.find((item) => item.type === type);

      const node: TopologyNode = {
        id: formatNodeId(type),
        type,
        position,
        data: {
          label: component?.defaultName ?? type,
          type,
          nodeType: type,
        },
        width: DEFAULT_NODE_SIZE.width,
        height: DEFAULT_NODE_SIZE.height,
      };
      placeNode(node);
    },
    [placeNode],
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
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1b2230" />
        <Controls />
        <MiniMap
          pannable
          zoomable
          bgColor="var(--color-panel-bg)"
          nodeColor="var(--color-accent)"
          maskColor="rgba(7, 9, 15, 0.7)"
        />
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
