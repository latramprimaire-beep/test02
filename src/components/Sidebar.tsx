import React from 'react';
import { BlockType } from '../types';

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: BlockType, label: string, color: string, value?: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, label, color, value }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/30 flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Bibliothèque de Blocs</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] cursor-pointer hover:bg-blue-500/20">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>Mouvement
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] cursor-pointer hover:bg-purple-500/20">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>Apparence
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[11px] cursor-pointer hover:bg-yellow-500/20">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>Événements
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div
          className="p-2.5 bg-yellow-600 rounded-md border-l-4 border-yellow-400 text-xs text-white font-medium cursor-grab active:cursor-grabbing hover:opacity-90"
          onDragStart={(e) => onDragStart(e, 'event_flag', 'Quand le drapeau pressé', '#ca8a04')}
          draggable
        >
          Quand le drapeau pressé
        </div>

        <div
          className="p-2.5 bg-blue-600 rounded-md border-l-4 border-blue-400 text-xs text-white font-medium cursor-grab active:cursor-grabbing hover:opacity-90 flex justify-between"
          onDragStart={(e) => onDragStart(e, 'motion_move', 'Avancer de', '#2563eb', '10')}
          draggable
        >
          <span>Avancer de</span>
          <span className="bg-white/20 px-1.5 rounded text-[10px]">10</span>
        </div>
        
        <div
          className="p-2.5 bg-blue-600 rounded-md border-l-4 border-blue-400 text-xs text-white font-medium cursor-grab active:cursor-grabbing hover:opacity-90 flex justify-between"
          onDragStart={(e) => onDragStart(e, 'motion_turn', 'Tourner de', '#2563eb', '15')}
          draggable
        >
          <span>Tourner de</span>
          <span className="bg-white/20 px-1.5 rounded text-[10px]">15</span>
        </div>

        <div
          className="p-2.5 bg-purple-600 rounded-md border-l-4 border-purple-400 text-xs text-white font-medium cursor-grab active:cursor-grabbing hover:opacity-90"
          onDragStart={(e) => onDragStart(e, 'looks_say', 'Dire', '#9333ea', 'Bonjour')}
          draggable
        >
          Dire [Bonjour]
        </div>
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Mode de rendu</div>
        <div className="flex gap-1 p-1 bg-slate-950 rounded border border-slate-800">
          <div className="flex-1 py-1 text-center text-[10px] bg-indigo-600 text-white rounded shadow-sm">REACT FLOW</div>
          <div className="flex-1 py-1 text-center text-[10px] text-slate-400">CANVAS 2D</div>
        </div>
      </div>
    </aside>
  );
}
