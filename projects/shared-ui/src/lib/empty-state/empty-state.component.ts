
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-empty-state',
  standalone: true,
  imports: [],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css'
})
export class EmptyStateComponent {
  @Input() message = '';
}
