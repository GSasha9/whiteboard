export type ShapeType =
  'rectangle' | 'circle' | 'triangle' | 'line' | 'arrow' | 'star';

export interface BaseWhiteboardObject {
  id: string;
  x: number;
  y: number;
  createdAt: string;
  updatedAt: string;
}

export interface RectangleObject extends BaseWhiteboardObject {
  type: 'rectangle';
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface CircleObject extends BaseWhiteboardObject {
  type: 'circle';
  radius: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface TriangleObject extends BaseWhiteboardObject {
  type: 'triangle';
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface LineObject extends BaseWhiteboardObject {
  type: 'line';
  points: number[];
  stroke: string;
  strokeWidth: number;
}

export interface ArrowObject extends BaseWhiteboardObject {
  type: 'arrow';
  points: number[];
  stroke: string;
  strokeWidth: number;
}

export interface StarObject extends BaseWhiteboardObject {
  type: 'star';
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export type WhiteboardObject =
  | RectangleObject
  | CircleObject
  | TriangleObject
  | LineObject
  | ArrowObject
  | StarObject;
