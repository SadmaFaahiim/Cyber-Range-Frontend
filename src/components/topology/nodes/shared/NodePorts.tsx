import { Handle, Position } from '@xyflow/react';
import { Fragment } from 'react';

import type { PortSide } from '@/types/topology';

const PORTS: { side: PortSide; position: Position }[] = [
  { side: 'top', position: Position.Top },
  { side: 'right', position: Position.Right },
  { side: 'bottom', position: Position.Bottom },
  { side: 'left', position: Position.Left },
];

const HANDLE_CLASS = '!h-2.5 !w-2.5 !border-2 !border-white !bg-accent dark:!border-[rgba(23,28,42,0.9)]';

export function sourceHandleId(side: PortSide): string {
  return `${side}-source`;
}

export function targetHandleId(side: PortSide): string {
  return `${side}-target`;
}

export default function NodePorts() {
  return (
    <>
      {PORTS.map(({ side, position }) => (
        <Fragment key={side}>
          <Handle type="target" id={targetHandleId(side)} position={position} className={HANDLE_CLASS} />
          <Handle type="source" id={sourceHandleId(side)} position={position} className={HANDLE_CLASS} />
        </Fragment>
      ))}
    </>
  );
}
