import type { EdgeTypes, NodeTypes } from '@xyflow/react';

import CableEdge from '@/components/topology/edges/CableEdge';
import PCNode from '@/components/topology/nodes/PCNode';
import RouterNode from '@/components/topology/nodes/RouterNode';

export const nodeTypes = { pc: PCNode, router: RouterNode } satisfies NodeTypes;
export const edgeTypes = { cable: CableEdge } satisfies EdgeTypes;
