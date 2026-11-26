import type { IconName } from '../icon-button/icon-button.types';

interface EditingTool {
  icon: IconName;
  label: string;
}

export const EDITING_TOOLS: readonly EditingTool[] = [
  { icon: 'cursor', label: 'Select' },
  { icon: 'hand', label: 'Pan' },
  { icon: 'pen', label: 'Freehand' },
  { icon: 'shapes', label: 'Shapes' },
  { icon: 'arrow', label: 'Arrow / Line' },
  { icon: 'text', label: 'Text' },
  { icon: 'sticky', label: 'Sticky note' },
  { icon: 'image', label: 'Image' },
  { icon: 'apps', label: 'More tools' },
];
