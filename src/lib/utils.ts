import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { InfrastructureNodeType } from '@/types/infrastructure';
import type { NodePosition } from '@/types/topology';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function clampMinDistance(point: NodePosition, anchor: NodePosition, minDistance: number): NodePosition {
  const dx = point.x - anchor.x;
  const dy = point.y - anchor.y;
  const distance = Math.hypot(dx, dy);
  if (distance >= minDistance) {
    return point;
  }
  if (distance === 0) {
    return { x: anchor.x + minDistance, y: anchor.y };
  }
  const scale = minDistance / distance;
  return { x: anchor.x + dx * scale, y: anchor.y + dy * scale };
}

const idCounters: Record<string, number> = {};

export function formatNodeId(kind: 'pc' | 'router' | 'edge'): string {
  const next = (idCounters[kind] ?? 0) + 1;
  idCounters[kind] = next;
  return `${kind}-${String(next).padStart(2, '0')}`;
}

export function getNodeDisplayName(type: InfrastructureNodeType): string {
  return type === 'pc' ? 'PC' : 'Router';
}
