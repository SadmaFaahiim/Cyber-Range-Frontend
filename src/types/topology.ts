import type { Edge, Node, XYPosition } from '@xyflow/react';

import type { InfrastructureNodeType } from './infrastructure';

export type TopologyNodeType = InfrastructureNodeType;

export interface TopologyNodeData {
  label: string;
  type: TopologyNodeType;
  componentRef?: string;
  [key: string]: unknown;
}

export type TopologyNode = Node<TopologyNodeData, TopologyNodeType>;
export type TopologyEdge = Edge;

export type NodePosition = XYPosition;
