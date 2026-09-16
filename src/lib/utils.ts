import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { InfrastructureNodeType } from '@/types/infrastructure';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
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
