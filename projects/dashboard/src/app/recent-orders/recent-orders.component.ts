import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from 'shared-data';
import { EmptyStateComponent } from 'shared-ui';


@Component({
  selector: 'app-recent-orders',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  templateUrl: './recent-orders.component.html',
  styleUrl: './recent-orders.component.scss'
})
export class RecentOrdersComponent {
  @Input({ required: true }) orders: Order[]= [];
}
