import { Edge, Node } from '@xyflow/react';

export const templates: Record<string, { nodes: Node[]; edges: Edge[] }> = {
  hello: {
    nodes: [
      { id: '1', type: 'scratchBlock', position: { x: 250, y: 100 }, data: { label: 'Quand le drapeau pressé', type: 'event_flag', color: '#ca8a04' } },
      { id: '2', type: 'scratchBlock', position: { x: 250, y: 200 }, data: { label: 'Dire', type: 'looks_say', value: 'Bonjour !', color: '#9333ea' } },
    ],
    edges: [{ id: 'e1-2', source: '1', target: '2' }],
  },
  square: {
    nodes: [
      { id: '1', type: 'scratchBlock', position: { x: 250, y: 50 }, data: { label: 'Quand le drapeau pressé', type: 'event_flag', color: '#ca8a04' } },
      { id: '2', type: 'scratchBlock', position: { x: 250, y: 150 }, data: { label: 'Avancer de', type: 'motion_move', value: '100', color: '#2563eb' } },
      { id: '3', type: 'scratchBlock', position: { x: 250, y: 250 }, data: { label: 'Tourner de', type: 'motion_turn', value: '90', color: '#2563eb' } },
      { id: '4', type: 'scratchBlock', position: { x: 250, y: 350 }, data: { label: 'Avancer de', type: 'motion_move', value: '100', color: '#2563eb' } },
      { id: '5', type: 'scratchBlock', position: { x: 250, y: 450 }, data: { label: 'Tourner de', type: 'motion_turn', value: '90', color: '#2563eb' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
    ],
  },
};
