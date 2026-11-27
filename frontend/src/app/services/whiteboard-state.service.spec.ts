import { WhiteboardStateService } from './whiteboard-state.service';

describe('WhiteboardStateService', () => {
  it('creates shape objects with normalized bounds when dragged in reverse', () => {
    const state = new WhiteboardStateService();

    const rectangle = state.addShape(
      'rectangle',
      { x: 80, y: 70 },
      { x: 20, y: 10 },
    );

    expect(rectangle).toMatchObject({
      type: 'rectangle',
      x: 20,
      y: 10,
      width: 60,
      height: 60,
    });
    expect(state.objects()).toEqual([rectangle]);
  });

  it('keeps line endpoints oriented and supports each shape type', () => {
    const state = new WhiteboardStateService();
    const line = state.addShape('line', { x: 90, y: 60 }, { x: 10, y: 20 });
    const shapes = [
      'rectangle',
      'circle',
      'triangle',
      'line',
      'arrow',
      'star',
    ] as const;

    expect(line).toMatchObject({
      type: 'line',
      x: 10,
      y: 20,
      points: [80, 40, 0, 0],
    });
    for (const shape of shapes) {
      expect(
        state.addShape(shape, { x: 0, y: 0 }, { x: 20, y: 30 })?.type,
      ).toBe(shape);
    }
    expect(new Set(state.objects().map((object) => object.id)).size).toBe(7);
  });

  it('does not store invalid zero-size shapes', () => {
    const state = new WhiteboardStateService();

    expect(
      state.addShape('rectangle', { x: 10, y: 10 }, { x: 10, y: 30 }),
    ).toBeNull();
    expect(
      state.addShape('line', { x: 10, y: 10 }, { x: 10, y: 10 }),
    ).toBeNull();
    expect(state.objects()).toEqual([]);
  });

  it('switches between selecting and the active shape tool', () => {
    const state = new WhiteboardStateService();

    state.selectShape('star');
    expect(state.activeTool()).toBe('shape');
    expect(state.selectedShape()).toBe('star');

    state.selectTool();
    expect(state.activeTool()).toBe('select');
  });
});
