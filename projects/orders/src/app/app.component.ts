import { Component, inject } from '@angular/core';
import { PageHeaderComponent } from 'shared-ui';
import { Order } from 'shared-data';
import { OrdersListComponent } from "./orders-list/orders-list.component";
import { OrdersFacade } from './orders.facade';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PageHeaderComponent, OrdersListComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private facade = inject(OrdersFacade);

  orders$ = this.facade.orders$;

  createMockOrder(): void {
    const newOrder: Order = {
      id: Date.now(),
      customerName: 'New Customer',
      total: 250,
      status: 'pending'
    };

    this.facade.createOrder(newOrder);
  }
}
