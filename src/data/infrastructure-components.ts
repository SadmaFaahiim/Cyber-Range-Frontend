export interface PaletteComponent {
  type: 'pc' | 'router';
  label: string;
  description: string;
  icon: string;
  defaultName: string;
}

export const DEFAULT_NODE_SIZE = { width: 120, height: 80 };

export const SNAP_GRID: [number, number] = [20, 20];

export const INFRASTRUCTURE_COMPONENTS: PaletteComponent[] = [
  {
    type: 'pc',
    label: 'PC',
    description: 'Workstation or end-user device',
    icon: 'Monitor',
    defaultName: 'PC',
  },
  {
    type: 'router',
    label: 'Router',
    description: 'Network routing device',
    icon: 'RouterIcon',
    defaultName: 'Router',
  },
];
