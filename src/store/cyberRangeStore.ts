import { create } from 'zustand';

import type { TopologyEdge, TopologyNode } from '@/types/topology';

export interface CyberRangeState {
  currentStep: number;
  canvasNodes: TopologyNode[];
  canvasEdges: TopologyEdge[];
  selectedNodeId: string | null;
  infrastructureMode: 'builder';
  cablePlacementActive: boolean;
  cablePlacementSourceId: string | null;
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
  connectNodes: (edge: TopologyEdge) => void;
  removeEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
  updateReadiness: (readiness: { infrastructure: boolean; overall: boolean }) => void;
  setCablePlacementActive: (active: boolean) => void;
  setCablePlacementSourceId: (id: string | null) => void;
  reset: () => void;
}

export const INITIAL_READINESS = { infrastructure: false, overall: false };

const useCyberRangeStore = create<CyberRangeState & CyberRangeActions>()((set) => ({
  currentStep: 1,
  canvasNodes: [],
  canvasEdges: [],
  selectedNodeId: null,
  infrastructureMode: 'builder',
  cablePlacementActive: false,
  cablePlacementSourceId: null,
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

  connectNodes: (edge) => set((state) => ({ canvasEdges: [...state.canvasEdges, edge] })),

  removeEdge: (id) =>
    set((state) => ({
      canvasEdges: state.canvasEdges.filter((edge) => edge.id !== id),
    })),

  selectNode: (id) => set({ selectedNodeId: id }),

  updateReadiness: (readiness) => set({ readiness }),

  setCablePlacementActive: (active) => set({ cablePlacementActive: active, cablePlacementSourceId: null }),

  setCablePlacementSourceId: (id) => set({ cablePlacementSourceId: id }),

  reset: () =>
    set({
      currentStep: 1,
      canvasNodes: [],
      canvasEdges: [],
      selectedNodeId: null,
      cablePlacementActive: false,
      cablePlacementSourceId: null,
      readiness: { ...INITIAL_READINESS },
    }),
}));

export default useCyberRangeStore;
