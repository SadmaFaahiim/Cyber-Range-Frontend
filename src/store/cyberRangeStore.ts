import { create } from 'zustand';

import type { OperatingSystem } from '@/types/pc';
import type { CableAnchor, NodePosition, PendingCable, TopologyEdge, TopologyNode } from '@/types/topology';

export interface CyberRangeState {
  currentStep: number;
  canvasNodes: TopologyNode[];
  canvasEdges: TopologyEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  infrastructureMode: 'builder';
  pendingCable: PendingCable | null;
  readiness: {
    infrastructure: boolean;
    overall: boolean;
  };
}

export interface CyberRangeActions {
  setStep: (step: number) => void;
  placeNode: (node: TopologyNode) => void;
  removeNode: (id: string) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  updateNodeLabel: (id: string, label: string) => void;
  setPcOperatingSystem: (id: string, os: OperatingSystem | null) => void;
  connectNodes: (edge: TopologyEdge) => void;
  removeEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  updateReadiness: (readiness: { infrastructure: boolean; overall: boolean }) => void;
  startPendingCable: (
    start: NodePosition,
    end: NodePosition,
    startAnchor?: CableAnchor | null,
    endAnchor?: CableAnchor | null,
  ) => void;
  updatePendingCableEnd: (end: 'start' | 'end', position: NodePosition) => void;
  setPendingCableAnchor: (end: 'start' | 'end', anchor: CableAnchor | null) => void;
  cancelPendingCable: () => void;
  reset: () => void;
}

export const INITIAL_READINESS = { infrastructure: false, overall: false };

const useCyberRangeStore = create<CyberRangeState & CyberRangeActions>()((set) => ({
  currentStep: 1,
  canvasNodes: [],
  canvasEdges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  infrastructureMode: 'builder',
  pendingCable: null,
  readiness: { ...INITIAL_READINESS },

  setStep: (step) => set({ currentStep: step }),

  placeNode: (node) => set((state) => ({ canvasNodes: [...state.canvasNodes, node] })),

  removeNode: (id) =>
    set((state) => ({
      canvasNodes: state.canvasNodes.filter((node) => node.id !== id),
      canvasEdges: state.canvasEdges.filter((edge) => edge.source !== id && edge.target !== id),
    })),

  updateNodePosition: (id, position) =>
    set((state) => ({
      canvasNodes: state.canvasNodes.map((node) => (node.id === id ? { ...node, position } : node)),
    })),

  updateNodeLabel: (id, label) =>
    set((state) => ({
      canvasNodes: state.canvasNodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label } } : node,
      ),
    })),

  setPcOperatingSystem: (id, os) =>
    set((state) => ({
      canvasNodes: state.canvasNodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, operatingSystem: os } } : node,
      ),
    })),

  connectNodes: (edge) => set((state) => ({ canvasEdges: [...state.canvasEdges, edge] })),

  removeEdge: (id) =>
    set((state) => ({
      canvasEdges: state.canvasEdges.filter((edge) => edge.id !== id),
      selectedEdgeId: state.selectedEdgeId === id ? null : state.selectedEdgeId,
    })),

  selectNode: (id) =>
    set((state) => ({
      selectedNodeId: id,
      selectedEdgeId: id ? null : state.selectedEdgeId,
    })),

  selectEdge: (id) =>
    set((state) => ({
      selectedEdgeId: id,
      selectedNodeId: id ? null : state.selectedNodeId,
    })),

  updateReadiness: (readiness) => set({ readiness }),

  startPendingCable: (start, end, startAnchor = null, endAnchor = null) =>
    set({ pendingCable: { id: 'pending-cable', start, end, startAnchor, endAnchor } }),

  updatePendingCableEnd: (end, position) =>
    set((state) => (state.pendingCable ? { pendingCable: { ...state.pendingCable, [end]: position } } : {})),

  setPendingCableAnchor: (end, anchor) =>
    set((state) => {
      if (!state.pendingCable) {
        return {};
      }
      return {
        pendingCable:
          end === 'start'
            ? { ...state.pendingCable, startAnchor: anchor }
            : { ...state.pendingCable, endAnchor: anchor },
      };
    }),

  cancelPendingCable: () => set({ pendingCable: null }),

  reset: () =>
    set({
      currentStep: 1,
      canvasNodes: [],
      canvasEdges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
      pendingCable: null,
      readiness: { ...INITIAL_READINESS },
    }),
}));

export default useCyberRangeStore;
