import { Component } from '@angular/core';
import { EditingToolbarComponent } from './components/editing-toolbar/editing-toolbar';
import { PropertiesPanelComponent } from './components/properties-panel/properties-panel';
import { TopToolbarComponent } from './components/top-toolbar/top-toolbar';
import { WhiteboardCanvasComponent } from './components/whiteboard-canvas/whiteboard-canvas';

@Component({
  selector: 'app-root',
  imports: [
    EditingToolbarComponent,
    PropertiesPanelComponent,
    TopToolbarComponent,
    WhiteboardCanvasComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
