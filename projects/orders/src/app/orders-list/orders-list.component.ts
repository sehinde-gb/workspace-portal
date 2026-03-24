import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from 'shared-data';
import { EmptyStateComponent } from 'shared-ui';
import { OrderCardComponent } from '../order-card/order-card.component';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [ CommonModule, EmptyStateComponent, OrderCardComponent],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss'
})
export class OrdersListComponent {
  @Input() orders: Order[] = [];
  @Output() orderSelected = new EventEmitter<Order>();

  selectOrder(order: Order): void {
    this.orderSelected.emit(order);
  }
}
