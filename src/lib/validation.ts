import type { TopologyEdge, TopologyNode } from '@/types/topology';

import { APP_STRINGS } from './strings';

export const ROUTE_MINIMUM_STEPS: Record<string, number> = {
  '/': 1,
  '/build': 1,
  '/review': 2,
  '/ready': 3,
};

export function validateStepAccess(currentStep: number, pathname: string): boolean {
  const minimum = ROUTE_MINIMUM_STEPS[pathname] ?? 1;
  return currentStep >= minimum;
}

export type ReadinessStatus = 'ready' | 'warning' | 'none';

export interface ReadinessIssue {
  code: 'empty-canvas' | 'no-router' | 'standalone-node';
  message: string;
}

export interface ReadinessReport {
  status: ReadinessStatus;
  issues: ReadinessIssue[];
}

export function computeReadiness(nodes: TopologyNode[], edges: TopologyEdge[]): ReadinessReport {
  const issues: ReadinessIssue[] = [];

  if (nodes.length === 0) {
    return { status: 'none', issues: [{ code: 'empty-canvas', message: APP_STRINGS.VALIDATION.EMPTY }] };
  }

  const hasRouter = nodes.some((node) => node.data.type === 'router');
  if (!hasRouter) {
    issues.push({ code: 'no-router', message: APP_STRINGS.VALIDATION.NO_ROUTER });
  }

  if (nodes.length > 1) {
    const connected = new Set<string>();
    for (const edge of edges) {
      connected.add(edge.source);
      connected.add(edge.target);
    }
    const hasStandalone = nodes.some((node) => !connected.has(node.id));
    if (hasStandalone) {
      issues.push({ code: 'standalone-node', message: APP_STRINGS.VALIDATION.STANDALONE });
    }
  }

  return { status: issues.length === 0 ? 'ready' : 'warning', issues };
}
