import { describe, expect, it } from 'vitest';

import { validateInfrastructureCanvas, validateNoOverlap, validateReadiness } from '@/lib/validation';
import type { TopologyEdge, TopologyNode } from '@/types/topology';

function makeNode(id: string, x: number, y: number): TopologyNode {
  return {
    id,
    type: 'pc',
    position: { x, y },
    data: { label: 'PC', type: 'pc' },
  };
}

function makeRouter(id: string, x: number, y: number): TopologyNode {
  return {
    id,
    type: 'router',
    position: { x, y },
    data: { label: 'Router', type: 'router' },
  };
}

function makeEdge(id: string, source: string, target: string): TopologyEdge {
  return { id, source, target, type: 'cable' };
}

describe('validateInfrastructureCanvas', () => {
  it('returns false when nodes array is empty', () => {
    expect(validateInfrastructureCanvas([], [])).toBe(false);
  });

  it('returns false when only 1 node and no edges', () => {
    const nodes = [makeNode('a', 0, 0)];
    expect(validateInfrastructureCanvas(nodes, [])).toBe(false);
  });

  it('returns false when 2 nodes but no edges', () => {
    const nodes = [makeNode('a', 0, 0), makeRouter('b', 300, 300)];
    expect(validateInfrastructureCanvas(nodes, [])).toBe(false);
  });

  it('returns true when 2 nodes and 1 edge', () => {
    const nodes = [makeNode('a', 0, 0), makeRouter('b', 300, 300)];
    const edges = [makeEdge('e1', 'a', 'b')];
    expect(validateInfrastructureCanvas(nodes, edges)).toBe(true);
  });

  it('returns true when 3 nodes and 2 edges', () => {
    const nodes = [makeNode('a', 0, 0), makeRouter('b', 300, 300), makeNode('c', 600, 300)];
    const edges = [makeEdge('e1', 'a', 'b'), makeEdge('e2', 'b', 'c')];
    expect(validateInfrastructureCanvas(nodes, edges)).toBe(true);
  });
});

describe('validateNoOverlap', () => {
  it('returns true when nodes array is empty', () => {
    expect(validateNoOverlap([])).toBe(true);
  });

  it('returns true when only 1 node', () => {
    expect(validateNoOverlap([makeNode('a', 0, 0)])).toBe(true);
  });

  it('returns true when 2 nodes far apart (positions 300px apart)', () => {
    const nodes = [makeNode('a', 0, 0), makeRouter('b', 300, 300)];
    expect(validateNoOverlap(nodes)).toBe(true);
  });

  it('returns false when 2 nodes at same position', () => {
    const nodes = [makeNode('a', 0, 0), makeRouter('b', 0, 0)];
    expect(validateNoOverlap(nodes)).toBe(false);
  });

  it('returns false when 2 nodes overlapping (positions 50px apart)', () => {
    const nodes = [makeNode('a', 0, 0), makeRouter('b', 50, 0)];
    expect(validateNoOverlap(nodes)).toBe(false);
  });
});

describe('validateReadiness', () => {
  it('returns overall false when no nodes and no edges', () => {
    const report = validateReadiness([], []);
    expect(report.overall).toBe(false);
  });

  it('returns overall false when nodes present but no edges', () => {
    const nodes = [makeNode('a', 0, 0), makeRouter('b', 300, 300)];
    const report = validateReadiness(nodes, []);
    expect(report.overall).toBe(false);
  });

  it('returns overall true when 2 nodes, 1 edge, no overlap', () => {
    const nodes = [makeNode('a', 0, 0), makeRouter('b', 300, 300)];
    const edges = [makeEdge('e1', 'a', 'b')];
    const report = validateReadiness(nodes, edges);
    expect(report.overall).toBe(true);
  });

  it('checks structure: result has infrastructure, overall, checks', () => {
    const report = validateReadiness([], []);
    expect(report).toHaveProperty('infrastructure');
    expect(report).toHaveProperty('overall');
    expect(report).toHaveProperty('checks');
    expect(report.checks).toHaveProperty('hasNodes');
    expect(report.checks).toHaveProperty('hasConnections');
    expect(report.checks).toHaveProperty('noOverlap');
  });

  it('checks.hasNodes true when nodes.length >= 2', () => {
    const nodes = [makeNode('a', 0, 0), makeRouter('b', 300, 300)];
    const report = validateReadiness(nodes, []);
    expect(report.checks.hasNodes).toBe(true);
    expect(validateReadiness([makeNode('a', 0, 0)], []).checks.hasNodes).toBe(false);
  });

  it('checks.hasConnections true when edges.length >= 1', () => {
    const nodes = [makeNode('a', 0, 0), makeRouter('b', 300, 300)];
    const edges = [makeEdge('e1', 'a', 'b')];
    const report = validateReadiness(nodes, edges);
    expect(report.checks.hasConnections).toBe(true);
  });

  it('checks.noOverlap true when no overlapping nodes', () => {
    const nodes = [makeNode('a', 0, 0), makeRouter('b', 300, 300)];
    const report = validateReadiness(nodes, []);
    expect(report.checks.noOverlap).toBe(true);
  });
});
