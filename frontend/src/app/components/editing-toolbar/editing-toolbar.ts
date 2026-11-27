import { Component, inject } from '@angular/core';
import { EDITING_TOOLS } from './editing-toolbar.constants';
import { IconButtonComponent } from '../icon-button/icon-button';
import { WhiteboardStateService } from '../../services/whiteboard-state.service';
import type { ShapeType } from '../../models/whiteboard-object';

interface ShapeOption {
  type: ShapeType;
  label: string;
}

@Component({
  selector: 'app-editing-toolbar',
  imports: [IconButtonComponent],
  templateUrl: './editing-toolbar.html',
  styleUrl: './editing-toolbar.scss',
})
export class EditingToolbarComponent {
  private readonly whiteboardState = inject(WhiteboardStateService);
  protected readonly tools = EDITING_TOOLS;
  protected readonly shapes: readonly ShapeOption[] = [
    { type: 'rectangle', label: 'Rectangle' },
    { type: 'circle', label: 'Circle' },
    { type: 'triangle', label: 'Triangle' },
    { type: 'line', label: 'Line' },
    { type: 'arrow', label: 'Arrow' },
    { type: 'star', label: 'Star' },
  ];

  protected readonly activeTool = this.whiteboardState.activeTool;
  protected readonly selectedShape = this.whiteboardState.selectedShape;
  protected shapesMenuOpen = false;

  protected handleToolPress(index: number, event: MouseEvent): void {
    event.stopPropagation();
    if (index === 3) {
      this.shapesMenuOpen = !this.shapesMenuOpen;
      return;
    }

    this.shapesMenuOpen = false;
    if (index === 0) {
      this.whiteboardState.selectTool();
    }
  }

  protected selectShape(shape: ShapeType, event: MouseEvent): void {
    event.stopPropagation();
    this.whiteboardState.selectShape(shape);
    this.shapesMenuOpen = false;
  }
}
//check
