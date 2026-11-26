import { Component } from '@angular/core';
import { TOP_TOOLBAR_ACTIONS } from './top-toolbar.constants';
import { IconButtonComponent } from '../icon-button/icon-button';

@Component({
  selector: 'app-top-toolbar',
  imports: [IconButtonComponent],
  templateUrl: './top-toolbar.html',
  styleUrl: './top-toolbar.scss',
})
export class TopToolbarComponent {
  protected readonly actions = TOP_TOOLBAR_ACTIONS;
}
