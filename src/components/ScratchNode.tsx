import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { ScratchNodeData } from '../types';

function getBorderColor(color?: string) {
  switch(color) {
    case '#ca8a04': return '#fde047'; // yellow
    case '#2563eb': return '#93c5fd'; // blue
    case '#9333ea': return '#d8b4fe'; // purple
    default: return '#93c5fd';
  }
}

export function ScratchBlockNode({ data }: { data: ScratchNodeData }) {
  const isTopLevel = data.type === 'event_flag';
  const borderColor = getBorderColor(data.color);

  return (
    <div
      className="relative rounded-md shadow-xl border-l-4 transition-colors font-bold"
      style={{ backgroundColor: data.color || '#2563eb', borderLeftColor: borderColor, minWidth: '180px' }}
    >
      {/* Top notch logic: Events don't have top connection */}
      {!isTopLevel && (
        <>
          <div className="absolute -top-[8px] left-4 w-[24px] h-[8px]" style={{ backgroundColor: data.color || '#2563eb', clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />
          <Handle
            type="target"
            position={Position.Top}
            className="w-full h-full opacity-0 !top-0 !transform-none !left-0 !bg-transparent"
            isConnectable={true}
          />
        </>
      )}

      {/* Main block content */}
      <div className="px-3 py-3 text-white text-xs flex items-center justify-between gap-3">
        <span>{data.label}</span>
        {data.value !== undefined && (
          <input
            type={typeof data.value === 'number' || !isNaN(Number(data.value)) ? 'number' : 'text'}
            value={data.value}
            onChange={(e) => data.onChange && data.onChange(e.target.value)}
            className="w-12 px-1.5 py-0.5 text-slate-900 font-mono text-xs text-center rounded bg-white/90 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
            onClick={(e) => e.stopPropagation()}
            onDragStart={(e) => e.preventDefault()}
            onDragOver={(e) => e.preventDefault()}
          />
        )}
      </div>

      {/* Bottom bump logic */}
      <div className="absolute -bottom-[8px] left-4 w-[24px] h-[8px]" style={{ backgroundColor: data.color || '#2563eb', clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)', zIndex: 10 }} />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-full h-full opacity-0 !bottom-0 !transform-none !left-0 !bg-transparent"
        isConnectable={true}
      />
    </div>
  );
}
