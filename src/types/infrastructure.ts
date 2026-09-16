export type InfrastructureNodeType = 'pc' | 'router';

export interface InfrastructureTemplate {
  id: string;
  name: string;
  description: string;
  category?: string;
  previewImage?: string;
  nodes: InfrastructureNode[];
  edges: InfrastructureEdge[];
}

export interface InfrastructureNode {
  id: string;
  type: InfrastructureNodeType;
  name: string;
  position: { x: number; y: number };
  metadata?: Record<string, string>;
}

export interface InfrastructureEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  label?: string;
}
