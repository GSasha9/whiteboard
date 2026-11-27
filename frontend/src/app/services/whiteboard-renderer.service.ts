import { Injectable } from '@angular/core';
import type Konva from 'konva';
import type { WhiteboardObject } from '../models/whiteboard-object';

type KonvaModule = typeof import('konva').default;

@Injectable({ providedIn: 'root' })
export class WhiteboardRendererService {
  private readonly rendered = new Map<
    string,
    { object: WhiteboardObject; node: Konva.Shape }
  >();

  syncObjects(
    konva: KonvaModule,
    layer: Konva.Layer,
    objects: WhiteboardObject[],
  ): void {
    const currentIds = new Set(objects.map((object) => object.id));
    const objectsById = new Map(objects.map((object) => [object.id, object]));

    for (const [id, rendered] of this.rendered) {
      if (!currentIds.has(id) || rendered.object !== objectsById.get(id)) {
        rendered.node.destroy();
        this.rendered.delete(id);
      }
    }

    for (const object of objects) {
      if (this.rendered.has(object.id)) {
        continue;
      }
      const node = this.createNode(konva, object);
      layer.add(node);
      this.rendered.set(object.id, { object, node });
    }
    layer.batchDraw();
  }

  clearObjects(): void {
    for (const { node } of this.rendered.values()) {
      node.destroy();
    }
    this.rendered.clear();
  }

  createPreview(
    konva: KonvaModule,
    layer: Konva.Layer,
    object: WhiteboardObject,
  ): void {
    layer.destroyChildren();
    layer.add(this.createNode(konva, object, true));
    layer.batchDraw();
  }

  clearPreview(layer: Konva.Layer): void {
    layer.destroyChildren();
    layer.batchDraw();
  }

  private createNode(
    konva: KonvaModule,
    object: WhiteboardObject,
    preview = false,
  ): Konva.Shape {
    const common = {
      id: object.id,
      name: 'whiteboard-object',
      x: object.x,
      y: object.y,
      stroke: object.stroke,
      strokeWidth: object.strokeWidth,
      fill: 'fill' in object ? object.fill : undefined,
      opacity: preview ? 0.6 : 1,
      listening: false,
    };

    switch (object.type) {
      case 'rectangle':
        return new konva.Rect({
          ...common,
          width: object.width,
          height: object.height,
        });
      case 'circle':
        return new konva.Circle({
          ...common,
          x: object.x + object.radius,
          y: object.y + object.radius,
          radius: object.radius,
        });
      case 'triangle': {
        const radius = (2 * object.height) / 3;
        return new konva.RegularPolygon({
          ...common,
          x: object.x + object.width / 2,
          y: object.y + object.height / 2,
          sides: 3,
          radius,
          scaleX: object.width / (Math.sqrt(3) * radius),
          scaleY: object.height / (1.5 * radius),
        });
      }
      case 'line':
        return new konva.Line({
          ...common,
          points: object.points,
        });
      case 'arrow':
        return new konva.Arrow({
          ...common,
          points: object.points,
          pointerLength: 10,
          pointerWidth: 10,
        });
      case 'star': {
        const radius = Math.min(object.width, object.height) / 2;
        return new konva.Star({
          ...common,
          x: object.x + object.width / 2,
          y: object.y + object.height / 2,
          numPoints: 5,
          innerRadius: radius * 0.5,
          outerRadius: radius,
          scaleX: object.width / (2 * radius),
          scaleY: object.height / (2 * radius),
        });
      }
    }
  }
}
