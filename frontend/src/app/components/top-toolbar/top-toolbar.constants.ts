import type { IconName } from '../icon-button/icon-button.types';

interface ToolbarAction {
  icon: IconName;
  label: string;
}

export const TOP_TOOLBAR_ACTIONS: readonly ToolbarAction[] = [
  { icon: 'undo', label: 'Undo' },
  { icon: 'redo', label: 'Redo' },
  { icon: 'trash', label: 'Delete' },
  { icon: 'more', label: 'More actions' },
];
