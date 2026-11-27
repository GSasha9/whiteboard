import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import type Konva from 'konva';
import { WhiteboardRendererService } from '../../services/whiteboard-renderer.service';
import { WhiteboardStateService } from '../../services/whiteboard-state.service';
import type { ShapeType } from '../../models/whiteboard-object';

@Component({
  selector: 'app-whiteboard-canvas',
  templateUrl: './whiteboard-canvas.html',
  styleUrl: './whiteboard-canvas.scss',
})
export class WhiteboardCanvasComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly whiteboardState = inject(WhiteboardStateService);
  private readonly renderer = inject(WhiteboardRendererService);

  @ViewChild('container', { static: true })
  private container!: ElementRef<HTMLDivElement>;

  private stage: Konva.Stage | null = null;
  private konva: typeof import('konva').default | null = null;
  private objectsLayer: Konva.Layer | null = null;
  private interactionLayer: Konva.Layer | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private startPoint: { x: number; y: number } | null = null;
  private drawingShape: ShapeType | null = null;
  private destroyed = false;

  private readonly objectsEffect = effect(() => {
    const objects = this.whiteboardState.objects();
    if (this.konva && this.objectsLayer) {
      this.renderer.syncObjects(this.konva, this.objectsLayer, objects);
    }
  });

  private readonly onMouseDown = (
    event: Konva.KonvaEventObject<MouseEvent>,
  ): void => {
    if (
      event.evt.button !== 0 ||
      this.whiteboardState.activeTool() !== 'shape' ||
      this.startPoint
    ) {
      return;
    }

    const position = this.getWorldPointerPosition(event.evt);
    if (!position) {
      return;
    }

    event.evt.preventDefault();
    this.startPoint = position;
    this.drawingShape = this.whiteboardState.selectedShape();
    this.whiteboardState.setDrawing(true);
    this.addWindowDrawingListeners();
  };

  private readonly onWindowPointerMove = (event: PointerEvent): void => {
    if (!this.startPoint || !this.drawingShape) {
      return;
    }
    this.stage?.setPointersPositions(event);
    const position = this.getWorldPointerPosition();
    if (!position || !this.konva || !this.interactionLayer) {
      return;
    }
    const preview = this.whiteboardState.previewShape(
      this.drawingShape,
      this.startPoint,
      position,
    );
    if (preview) {
      this.renderer.createPreview(this.konva, this.interactionLayer, preview);
    } else {
      this.renderer.clearPreview(this.interactionLayer);
    }
  };

  private readonly onWindowPointerUp = (event: PointerEvent): void => {
    if (!this.startPoint || !this.drawingShape) {
      return;
    }
    this.stage?.setPointersPositions(event);
    const position = this.getWorldPointerPosition();
    if (position) {
      this.whiteboardState.addShape(
        this.drawingShape,
        this.startPoint,
        position,
      );
    }
    this.stopDrawing();
  };

  private readonly onWindowPointerCancel = (): void => this.cancelDrawing();
  private readonly onWindowBlur = (): void => this.cancelDrawing();

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const { default: Konva } = await import('konva');
    if (this.destroyed) {
      return;
    }

    this.konva = Konva;
    const container = this.container.nativeElement;
    this.stage = new Konva.Stage({
      container,
      width: container.clientWidth,
      height: container.clientHeight,
    });
    const backgroundLayer = new Konva.Layer({
      listening: false,
      name: 'background-layer',
    });
    this.objectsLayer = new Konva.Layer({ name: 'objects-layer' });
    this.interactionLayer = new Konva.Layer({
      listening: false,
      name: 'interaction-layer',
    });
    this.stage.add(backgroundLayer, this.objectsLayer, this.interactionLayer);
    this.stage.on('mousedown', this.onMouseDown);
    this.renderer.syncObjects(
      Konva,
      this.objectsLayer,
      this.whiteboardState.objects(),
    );

    this.resizeObserver = new ResizeObserver(() => {
      this.stage?.size({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    });
    this.resizeObserver.observe(container);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.cancelDrawing();
    this.objectsEffect.destroy();
    this.resizeObserver?.disconnect();
    this.renderer.clearObjects();
    this.interactionLayer?.destroyChildren();
    this.stage?.off('mousedown', this.onMouseDown);
    this.stage?.destroy();
  }

  private getWorldPointerPosition(
    event?: Event,
  ): { x: number; y: number } | null {
    if (event) {
      this.stage?.setPointersPositions(event);
    }
    return this.interactionLayer?.getRelativePointerPosition() ?? null;
  }

  private addWindowDrawingListeners(): void {
    window.addEventListener('pointermove', this.onWindowPointerMove);
    window.addEventListener('pointerup', this.onWindowPointerUp);
    window.addEventListener('pointercancel', this.onWindowPointerCancel);
    window.addEventListener('blur', this.onWindowBlur);
  }

  private removeWindowDrawingListeners(): void {
    window.removeEventListener('pointermove', this.onWindowPointerMove);
    window.removeEventListener('pointerup', this.onWindowPointerUp);
    window.removeEventListener('pointercancel', this.onWindowPointerCancel);
    window.removeEventListener('blur', this.onWindowBlur);
  }

  private stopDrawing(): void {
    this.removeWindowDrawingListeners();
    if (this.interactionLayer) {
      this.renderer.clearPreview(this.interactionLayer);
    }
    this.startPoint = null;
    this.drawingShape = null;
    this.whiteboardState.setDrawing(false);
  }

  private cancelDrawing(): void {
    if (!this.startPoint) {
      return;
    }
    this.stopDrawing();
  }
}
//check
