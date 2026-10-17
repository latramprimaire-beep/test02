import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ScratchBlockNode } from './ScratchNode';
import { Sidebar } from './Sidebar';
import { generateSB3 } from '../lib/scratch-compiler';
import { templates } from '../lib/templates';
import { Download, LayoutTemplate, Trash2 } from 'lucide-react';

const nodeTypes = {
  scratchBlock: ScratchBlockNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

export function FlowEditor() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(templates.hello.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(templates.hello.edges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true, style: { strokeWidth: 3, stroke: '#64748b' } }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const nodeDataStr = event.dataTransfer.getData('application/reactflow');

      if (!nodeDataStr || !reactFlowBounds) return;

      const parsedData = JSON.parse(nodeDataStr);
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNodeId = getId();

      const newNode: Node = {
        id: newNodeId,
        type: 'scratchBlock',
        position,
        data: {
          ...parsedData,
          onChange: (val: string) => {
            setNodes((nds) =>
              nds.map((node) => {
                if (node.id === newNodeId) {
                  node.data = { ...node.data, value: val };
                }
                return node;
              })
            );
          },
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Bind onChange to initial template nodes
  const initializedNodes = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onChange: (val: string) => {
          setNodes((nds) =>
            nds.map((n) => {
              if (n.id === node.id) {
                n.data = { ...n.data, value: val };
              }
              return n;
            })
          );
        }
      }
    }));
  }, []); // Only run once on mount

  React.useEffect(() => {
    setNodes(initializedNodes);
  }, [initializedNodes, setNodes]);

  const exportSB3 = async () => {
    try {
      const blob = await generateSB3(nodes, edges);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'projet_genere.sb3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur lors de l'export", err);
      alert("Une erreur s'est produite lors de la génération du fichier SB3.");
    }
  };

  const loadTemplate = (key: keyof typeof templates) => {
    const template = templates[key];
    const newNodes = template.nodes.map(n => ({
      ...n,
      id: getId(),
    }));
    
    // Remap edges
    const idMap = new Map(template.nodes.map((n, i) => [n.id, newNodes[i].id]));
    const newEdges = template.edges.map(e => ({
      ...e,
      id: `e${idMap.get(e.source)}-${idMap.get(e.target)}`,
      source: idMap.get(e.source)!,
      target: idMap.get(e.target)!,
      animated: true,
      style: { strokeWidth: 3, stroke: '#64748b' }
    }));

    setNodes(newNodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        onChange: (val: string) => {
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === n.id) {
                node.data = { ...node.data, value: val };
              }
              return node;
            })
          );
        }
      }
    })));
    setEdges(newEdges);
  };

  const clearCanvas = () => {
    if (confirm("Voulez-vous vraiment effacer tous les blocs ?")) {
      setNodes([]);
      setEdges([]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden select-none">
      {/* Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/50 px-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">S</div>
          <h1 className="text-sm font-semibold tracking-tight">SCRATCH GENERATOR <span className="text-slate-500 font-mono text-xs ml-2 uppercase">v2.4.0</span></h1>
          <div className="h-6 w-px bg-slate-800 mx-2"></div>
          <input type="text" defaultValue="mon_projet_genial" className="bg-slate-800/50 border border-slate-700 px-3 py-1 rounded text-xs focus:outline-none focus:border-indigo-500 w-48 text-indigo-300"/>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4 border-r border-slate-800 pr-4">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Modèles:</span>
            <button onClick={() => loadTemplate('hello')} className="text-xs px-3 py-1.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded text-slate-300 flex items-center gap-1 transition-colors">
              <LayoutTemplate size={14} /> Hello World
            </button>
            <button onClick={() => loadTemplate('square')} className="text-xs px-3 py-1.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded text-slate-300 flex items-center gap-1 transition-colors">
              <LayoutTemplate size={14} /> Carré
            </button>
          </div>
          
          <button onClick={clearCanvas} className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition-colors" title="Effacer">
            <Trash2 size={16} />
          </button>

          <button 
            onClick={exportSB3}
            className="text-xs font-bold px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded flex items-center gap-2 transition-colors"
          >
            <span>TÉLÉCHARGER .SB3</span>
            <Download size={14} />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        <ReactFlowProvider>
          <Sidebar />
          <div className="flex-1 h-full bg-slate-950 relative" ref={reactFlowWrapper}>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              snapToGrid
              snapGrid={[15, 15]}
              defaultEdgeOptions={{
                animated: true,
                style: { strokeWidth: 3, stroke: '#64748b' },
              }}
            >
              <Controls className="bg-slate-900 border-slate-800 fill-slate-400 !shadow-none" />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
}
