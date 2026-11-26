import { Component, Input } from '@angular/core';
import type { IconButtonSize, IconName } from './icon-button.types';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.scss',
})
export class IconButtonComponent {
  @Input() icon: IconName = 'menu';
  @Input() label = '';
  @Input() active = false;
  @Input() size: IconButtonSize = 'medium';
}
