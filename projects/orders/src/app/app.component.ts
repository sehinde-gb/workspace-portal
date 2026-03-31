import { Component, inject } from '@angular/core';
import { PageHeaderComponent } from 'shared-ui';
import { Order } from 'shared-data';
import { OrdersListComponent } from "./orders-list/orders-list.component";
import { OrdersFacade } from './orders.facade';
import { NgIf } from "@angular/common";
import { CreateOrderComponent } from "../features/orders/components/create-order.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PageHeaderComponent, OrdersListComponent, NgIf, CreateOrderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private facade = inject(OrdersFacade);

  orders = this.facade.orders;
  loading = this.facade.loading;
  error = this.facade.error;
  totalOrders = this.facade.totalOrders;
  pendingOrders = this.facade.pendingOrders;
  totalRevenue = this.facade.totalRevenue;


  createMockOrder(): void {
    const newOrder: Order = {
      id: Date.now(),
      customerName: 'New Customer',
      total: 250,
      status: 'pending'
    };

    this.facade.createOrder(newOrder);
  }

  onOrderSelected(order: Order): void {
    console.log('Selected order:', order)
  }

  deleteOrder(order: Order): void {
    this.facade.deleteOrder(order);
  }


}
