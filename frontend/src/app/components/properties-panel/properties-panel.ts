import { Component } from '@angular/core';

@Component({
  selector: 'app-properties-panel',
  templateUrl: './properties-panel.html',
  styleUrl: './properties-panel.scss',
})
export class PropertiesPanelComponent {
  protected readonly colors = [
    '#242833',
    '#f06e65',
    '#f3b84e',
    '#81bf83',
    '#5d8feb',
    '#a47be0',
  ];
  protected readonly sizes = ['S', 'M', 'L'];
}
