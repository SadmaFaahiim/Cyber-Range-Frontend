import { act, type RenderHookResult, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import useCyberRangeStore, { type CyberRangeActions, type CyberRangeState } from '@/store/cyberRangeStore';
import type { TopologyEdge, TopologyNode } from '@/types/topology';

type StoreShape = CyberRangeState & CyberRangeActions;

function makeNode(id: string, type: 'pc' | 'router' = 'pc'): TopologyNode {
  return {
    id,
    type,
    position: { x: 100, y: 100 },
    data: { label: type === 'pc' ? 'PC' : 'Router', type },
  };
}

function makeEdge(id: string, source: string, target: string): TopologyEdge {
  return { id, source, target, type: 'cable' };
}

let store: RenderHookResult<StoreShape, unknown>;

function renderStore(): RenderHookResult<StoreShape, unknown> {
  return renderHook(() => useCyberRangeStore());
}

beforeEach(() => {
  store = renderStore();
  act(() => {
    store.result.current.reset();
  });
});

describe('cyberRangeStore', () => {
  it('has the expected initial state', () => {
    const state = store.result.current;
    expect(state.currentStep).toBe(1);
    expect(state.canvasNodes).toEqual([]);
    expect(state.canvasEdges).toEqual([]);
    expect(state.selectedNodeId).toBeNull();
    expect(state.readiness.infrastructure).toBe(false);
    expect(state.readiness.overall).toBe(false);
  });

  it('setStep sets currentStep to given value', () => {
    act(() => {
      store.result.current.setStep(2);
    });
    expect(store.result.current.currentStep).toBe(2);
  });

  it('placeNode adds a node to canvasNodes', () => {
    act(() => {
      store.result.current.placeNode(makeNode('pc-01'));
    });
    expect(store.result.current.canvasNodes).toHaveLength(1);
    expect(store.result.current.canvasNodes[0].id).toBe('pc-01');
  });

  it('removeNode removes node with matching id and its connected edges', () => {
    act(() => {
      store.result.current.placeNode(makeNode('pc-01'));
      store.result.current.placeNode(makeNode('router-01', 'router'));
      store.result.current.connectNodes(makeEdge('edge-01', 'pc-01', 'router-01'));
      store.result.current.removeNode('pc-01');
    });
    expect(store.result.current.canvasNodes).toHaveLength(1);
    expect(store.result.current.canvasEdges).toHaveLength(0);
  });

  it('updateNodeLabel updates node.data.label for matching id', () => {
    act(() => {
      store.result.current.placeNode(makeNode('pc-01'));
      store.result.current.updateNodeLabel('pc-01', 'Workstation A');
    });
    const node = store.result.current.canvasNodes.find((item) => item.id === 'pc-01');
    expect(node?.data.label).toBe('Workstation A');
  });

  it('connectNodes adds edge to canvasEdges', () => {
    act(() => {
      store.result.current.placeNode(makeNode('pc-01'));
      store.result.current.placeNode(makeNode('router-01', 'router'));
      store.result.current.connectNodes(makeEdge('edge-01', 'pc-01', 'router-01'));
    });
    expect(store.result.current.canvasEdges).toHaveLength(1);
    expect(store.result.current.canvasEdges[0].id).toBe('edge-01');
  });

  it('removeEdge removes edge with matching id', () => {
    act(() => {
      store.result.current.placeNode(makeNode('pc-01'));
      store.result.current.placeNode(makeNode('router-01', 'router'));
      store.result.current.connectNodes(makeEdge('edge-01', 'pc-01', 'router-01'));
      store.result.current.removeEdge('edge-01');
    });
    expect(store.result.current.canvasEdges).toHaveLength(0);
  });

  it('selectNode sets selectedNodeId to given id', () => {
    act(() => {
      store.result.current.selectNode('pc-01');
    });
    expect(store.result.current.selectedNodeId).toBe('pc-01');
  });

  it('selectNode sets selectedNodeId to null when called with null', () => {
    act(() => {
      store.result.current.selectNode('pc-01');
      store.result.current.selectNode(null);
    });
    expect(store.result.current.selectedNodeId).toBeNull();
  });

  it('reset restores all state to initial values', () => {
    act(() => {
      store.result.current.placeNode(makeNode('pc-01'));
      store.result.current.setStep(2);
    });
    act(() => {
      store.result.current.reset();
    });
    expect(store.result.current.canvasNodes).toEqual([]);
    expect(store.result.current.canvasEdges).toEqual([]);
    expect(store.result.current.currentStep).toBe(1);
    expect(store.result.current.selectedNodeId).toBeNull();
  });

  it('setPcOperatingSystem updates node.data.operatingSystem for matching id only', () => {
    act(() => {
      store.result.current.placeNode(makeNode('pc-01'));
      store.result.current.placeNode(makeNode('pc-02'));
      store.result.current.setPcOperatingSystem('pc-01', 'windows-11');
    });
    const pc1 = store.result.current.canvasNodes.find((item) => item.id === 'pc-01');
    const pc2 = store.result.current.canvasNodes.find((item) => item.id === 'pc-02');
    expect(pc1?.data.operatingSystem).toBe('windows-11');
    expect(pc2?.data.operatingSystem).toBeUndefined();
  });

  it('pendingCable lifecycle: start, update an end, set an anchor, cancel', () => {
    act(() => {
      store.result.current.startPendingCable({ x: 0, y: 0 }, { x: 80, y: 0 });
    });
    expect(store.result.current.pendingCable).toMatchObject({
      start: { x: 0, y: 0 },
      end: { x: 80, y: 0 },
      startAnchor: null,
      endAnchor: null,
    });

    act(() => {
      store.result.current.updatePendingCableEnd('end', { x: 120, y: 40 });
      store.result.current.setPendingCableAnchor('start', { nodeId: 'pc-01', side: 'right' });
    });
    expect(store.result.current.pendingCable).toMatchObject({
      end: { x: 120, y: 40 },
      startAnchor: { nodeId: 'pc-01', side: 'right' },
    });

    act(() => {
      store.result.current.cancelPendingCable();
    });
    expect(store.result.current.pendingCable).toBeNull();
  });
});
