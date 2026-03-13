import { Component, DestroyRef, inject } from '@angular/core';
import { PageHeaderComponent } from 'shared-ui';
import { Order } from 'shared-data';
import { OrdersListComponent } from "./orders-list/orders-list.component";
import { OrderEventsService } from 'shared-events';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
      console.log('[Orders] subscribed with instance', this.orderEvents.instanceId);

      this.orderEvents.orders$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((orders) => {
          console.log('[Orders] orders update', this.orderEvents.instanceId, orders);
          this.orders = orders;
        });
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
}
