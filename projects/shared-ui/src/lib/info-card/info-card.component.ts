import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-info-card',
  standalone: true,
  imports: [],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.css'
})
export class InfoCardComponent {
  @Input() label = '';
  @Input() value = '';
}
