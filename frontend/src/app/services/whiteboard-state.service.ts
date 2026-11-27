import { Injectable, signal } from '@angular/core';
import type {
  ArrowObject,
  CircleObject,
  LineObject,
  RectangleObject,
  ShapeType,
  StarObject,
  TriangleObject,
  WhiteboardObject,
} from '../models/whiteboard-object';

interface Point {
  x: number;
  y: number;
}

const STROKE = '#4268e8';
const FILL = '#eaf0ff';
const STROKE_WIDTH = 2;

function buildShapeObject(
  shape: ShapeType,
  start: Point,
  end: Point,
  id: string,
  now: string,
): WhiteboardObject | null {
  const minX = Math.min(start.x, end.x);
  const minY = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);
  const length = Math.hypot(width, height);

  if (
    ![start.x, start.y, end.x, end.y, width, height].every(Number.isFinite) ||
    (shape === 'line' || shape === 'arrow'
      ? length < 1
      : width < 1 || height < 1)
  ) {
    return null;
  }

  const base = { id, x: minX, y: minY, createdAt: now, updatedAt: now };
  switch (shape) {
    case 'rectangle':
      return {
        ...base,
        type: 'rectangle',
        width,
        height,
        fill: FILL,
        stroke: STROKE,
        strokeWidth: STROKE_WIDTH,
      } satisfies RectangleObject;
    case 'circle': {
      const radius = Math.min(width, height) / 2;
      return {
        ...base,
        type: 'circle',
        x: minX + width / 2 - radius,
        y: minY + height / 2 - radius,
        radius,
        fill: FILL,
        stroke: STROKE,
        strokeWidth: STROKE_WIDTH,
      } satisfies CircleObject;
    }
    case 'triangle':
      return {
        ...base,
        type: 'triangle',
        width,
        height,
        fill: FILL,
        stroke: STROKE,
        strokeWidth: STROKE_WIDTH,
      } satisfies TriangleObject;
    case 'line':
    case 'arrow':
      return {
        ...base,
        type: shape,
        points: [start.x - minX, start.y - minY, end.x - minX, end.y - minY],
        stroke: STROKE,
        strokeWidth: STROKE_WIDTH,
      } satisfies LineObject | ArrowObject;
    case 'star':
      return {
        ...base,
        type: 'star',
        width,
        height,
        fill: FILL,
        stroke: STROKE,
        strokeWidth: STROKE_WIDTH,
      } satisfies StarObject;
  }
}

@Injectable({ providedIn: 'root' })
export class WhiteboardStateService {
  readonly objects = signal<WhiteboardObject[]>([]);
  readonly activeTool = signal<'select' | 'shape'>('select');
  readonly selectedShape = signal<ShapeType>('rectangle');
  readonly drawing = signal(false);

  private idCounter = 0;

  selectTool(): void {
    this.activeTool.set('select');
  }

  selectShape(shape: ShapeType): void {
    this.selectedShape.set(shape);
    this.activeTool.set('shape');
  }

  setDrawing(drawing: boolean): void {
    this.drawing.set(drawing);
  }

  previewShape(
    shape: ShapeType,
    start: Point,
    end: Point,
  ): WhiteboardObject | null {
    return buildShapeObject(
      shape,
      start,
      end,
      'shape-preview',
      new Date().toISOString(),
    );
  }

  addShape(
    shape: ShapeType,
    start: Point,
    end: Point,
  ): WhiteboardObject | null {
    const now = new Date().toISOString();
    const object = buildShapeObject(shape, start, end, this.createId(), now);
    if (!object) {
      return null;
    }
    this.objects.update((objects) => [...objects, object]);
    return object;
  }

  private createId(): string {
    if (globalThis.crypto?.randomUUID) {
      return globalThis.crypto.randomUUID();
    }
    this.idCounter += 1;
    return `shape-${Date.now()}-${this.idCounter}`;
  }
}
