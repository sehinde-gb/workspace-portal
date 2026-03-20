import { Component, DestroyRef, inject } from '@angular/core';
import { PageHeaderComponent } from 'shared-ui';
import { Order } from 'shared-data';
import { OrdersListComponent } from "./orders-list/orders-list.component";
import { OrderEventsService } from 'shared-events';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PageHeaderComponent, OrdersListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private orderEvents = inject(OrderEventsService);
  private destroyRef = inject(DestroyRef);

  orders: Order[] = [];

  constructor() {
     this.syncFromStore();

     fromEvent(window, this.orderEvents.eventName)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.syncFromStore());
    }


  createMockOrder(): void {
    const newOrder: Order = {
      id: Date.now(),
      customerName: 'New Customer',
      total: 250,
      status: 'pending'
    };

    this.orderEvents.createOrder(newOrder);
  }

  private syncFromStore(): void {
    this.orders = this.orderEvents.getState().recentOrders;
  }
}
