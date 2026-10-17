import JSZip from 'jszip';
import { Node, Edge } from '@xyflow/react';
import { ScratchNodeData } from '../types';

const STAGE_SVG = `<svg version="1.1" width="2" height="2" viewBox="-1 -1 2 2" xmlns="http://www.w3.org/2000/svg"><g/></svg>`;
const SPRITE_SVG = `<svg version="1.1" width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#ff7b00"/><circle cx="35" cy="40" r="5" fill="white"/><circle cx="65" cy="40" r="5" fill="white"/><path d="M 40 70 Q 50 80 60 70" stroke="white" stroke-width="4" fill="transparent" stroke-linecap="round"/></svg>`;

export async function generateSB3(nodes: Node[], edges: Edge[]) {
  const zip = new JSZip();

  // Basic assets
  zip.file('bg.svg', STAGE_SVG);
  zip.file('sprite.svg', SPRITE_SVG);

  // Compile blocks
  const blocks: Record<string, any> = {};
  
  // Create a map for quick lookups
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const outgoingEdges = new Map<string, string>(); // source -> target
  const incomingEdges = new Map<string, string>(); // target -> source
  
  edges.forEach(e => {
    outgoingEdges.set(e.source, e.target);
    incomingEdges.set(e.target, e.source);
  });

  nodes.forEach(node => {
    const data = node.data as unknown as ScratchNodeData;
    const parentId = incomingEdges.get(node.id) || null;
    const nextId = outgoingEdges.get(node.id) || null;
    const isTopLevel = parentId === null;

    let opcode = '';
    let inputs: Record<string, any> = {};

    switch (data.type) {
      case 'event_flag':
        opcode = 'event_whenflagclicked';
        break;
      case 'motion_move':
        opcode = 'motion_movesteps';
        inputs = { STEPS: [1, [4, String(data.value || 10)]] };
        break;
      case 'motion_turn':
        opcode = 'motion_turnright';
        inputs = { DEGREES: [1, [4, String(data.value || 15)]] };
        break;
      case 'looks_say':
        opcode = 'looks_say';
        inputs = { MESSAGE: [1, [10, String(data.value || 'Hello')]] };
        break;
    }

    blocks[node.id] = {
      opcode,
      next: nextId,
      parent: parentId,
      inputs,
      fields: {},
      shadow: false,
      topLevel: isTopLevel,
      x: isTopLevel ? Math.round(node.position.x) : 0,
      y: isTopLevel ? Math.round(node.position.y) : 0,
    };
  });

  const projectJson = {
    targets: [
      {
        isStage: true,
        name: "Stage",
        variables: {},
        lists: {},
        broadcasts: {},
        blocks: {},
        comments: {},
        currentCostume: 0,
        costumes: [
          {
            assetId: "bg",
            name: "backdrop1",
            bitmapResolution: 1,
            md5ext: "bg.svg",
            dataFormat: "svg",
            rotationCenterX: 240,
            rotationCenterY: 180
          }
        ],
        sounds: [],
        volume: 100,
        videoTransparency: 50,
        videoState: "on"
      },
      {
        isStage: false,
        name: "Sprite1",
        variables: {},
        lists: {},
        broadcasts: {},
        blocks,
        comments: {},
        currentCostume: 0,
        costumes: [
          {
            assetId: "sprite",
            name: "costume1",
            bitmapResolution: 1,
            md5ext: "sprite.svg",
            dataFormat: "svg",
            rotationCenterX: 50,
            rotationCenterY: 50
          }
        ],
        sounds: [],
        volume: 100,
        visible: true,
        x: 0,
        y: 0,
        size: 100,
        direction: 90,
        draggable: false,
        rotationStyle: "all around"
      }
    ],
    meta: {
      semver: "3.0.0",
      vm: "0.2.0",
      agent: "Mozilla/5.0 (AI Studio Scratch Generator)"
    }
  };

  zip.file('project.json', JSON.stringify(projectJson));

  const blob = await zip.generateAsync({ type: 'blob' });
  return blob;
}
