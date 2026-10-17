export type BlockType = 'event_flag' | 'motion_move' | 'motion_turn' | 'looks_say';

export interface ScratchNodeData {
  label: string;
  type: BlockType;
  value?: string | number;
  color?: string;
  onChange?: (val: string) => void;
}
