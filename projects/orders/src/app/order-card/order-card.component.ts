import { Component, Input } from '@angular/core';
import { Order } from 'shared-data';
import { InfoCardComponent } from 'shared-ui';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [InfoCardComponent],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss'
})
export class OrderCardComponent {
  @Input({ required: true}) order!: Order;
}
