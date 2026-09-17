import { DEFAULT_NODE_SIZE } from '@/data/infrastructure-components';
import type { NodePosition, PortSide } from '@/types/topology';

export const PORT_SIDES: PortSide[] = ['top', 'right', 'bottom', 'left'];

interface PositionedNode {
  position: NodePosition;
  width?: number | null;
  height?: number | null;
}

export function getHandleFlowPosition(node: PositionedNode, side: PortSide): NodePosition {
  const width = node.width ?? DEFAULT_NODE_SIZE.width;
  const height = node.height ?? DEFAULT_NODE_SIZE.height;

  switch (side) {
    case 'top':
      return { x: node.position.x + width / 2, y: node.position.y };
    case 'bottom':
      return { x: node.position.x + width / 2, y: node.position.y + height };
    case 'left':
      return { x: node.position.x, y: node.position.y + height / 2 };
    case 'right':
      return { x: node.position.x + width, y: node.position.y + height / 2 };
    default:
      return node.position;
  }
}
