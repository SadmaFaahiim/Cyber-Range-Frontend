import type { Edge, Node, XYPosition } from '@xyflow/react';

import type { InfrastructureNodeType } from './infrastructure';
import type { OperatingSystem } from './pc';

export type TopologyNodeType = InfrastructureNodeType;

export interface TopologyNodeData {
  label: string;
  type: TopologyNodeType;
  componentRef?: string;
  operatingSystem?: OperatingSystem | null;
  [key: string]: unknown;
}

export type TopologyNode = Node<TopologyNodeData, TopologyNodeType>;

export interface CableEdgeData extends Record<string, unknown> {
  readinessPreview?: boolean;
}

export type TopologyEdge = Edge<CableEdgeData>;

export type NodePosition = XYPosition;

export type PortSide = 'top' | 'bottom' | 'left' | 'right';

export interface CableAnchor {
  nodeId: string;
  side: PortSide;
}

export interface PendingCable {
  id: string;
  start: NodePosition;
  end: NodePosition;
  startAnchor: CableAnchor | null;
  endAnchor: CableAnchor | null;
}
