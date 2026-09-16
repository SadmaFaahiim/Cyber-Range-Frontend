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

export const NODE_SIZE = { width: 120, height: 80 };

export const OVERLAP_THRESHOLD = 20;

export function validateNoOverlap(nodes: TopologyNode[]): boolean {
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i].position;
      const b = nodes[j].position;
      const width = NODE_SIZE.width + OVERLAP_THRESHOLD;
      const height = NODE_SIZE.height + OVERLAP_THRESHOLD;
      if (Math.abs(a.x - b.x) < width && Math.abs(a.y - b.y) < height) {
        return false;
      }
    }
  }
  return true;
}

export function validateInfrastructureCanvas(nodes: TopologyNode[], edges: TopologyEdge[]): boolean {
  return nodes.length >= 2 && edges.length >= 1 && validateNoOverlap(nodes);
}

export interface ReadinessChecks {
  hasNodes: boolean;
  hasConnections: boolean;
  noOverlap: boolean;
}

export interface ReadinessPayload {
  infrastructure: boolean;
  overall: boolean;
  checks: ReadinessChecks;
}

export function validateReadiness(nodes: TopologyNode[], edges: TopologyEdge[]): ReadinessPayload {
  const checks: ReadinessChecks = {
    hasNodes: nodes.length >= 2,
    hasConnections: edges.length >= 1,
    noOverlap: validateNoOverlap(nodes),
  };
  const ready = checks.hasNodes && checks.hasConnections && checks.noOverlap;
  return { infrastructure: ready, overall: ready, checks };
}
