import { Component } from '@angular/core';
import { EDITING_TOOLS } from './editing-toolbar.constants';
import { IconButtonComponent } from '../icon-button/icon-button';

@Component({
  selector: 'app-editing-toolbar',
  imports: [IconButtonComponent],
  templateUrl: './editing-toolbar.html',
  styleUrl: './editing-toolbar.scss',
})
export class EditingToolbarComponent {
  protected readonly tools = EDITING_TOOLS;
}
