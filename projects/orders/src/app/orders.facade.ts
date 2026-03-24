import { Injectable, inject, DestroyRef, signal, computed } from "@angular/core";
import { BehaviorSubject, fromEvent } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { OrderEventsService } from "shared-events";
import { Order } from "shared-data";

@Injectable({ providedIn: 'root'})

export class OrdersFacade {
  private orderEvents = inject(OrderEventsService);
  private destroyRef = inject(DestroyRef);


  orders = signal<Order[]>([]);

  /* find the length of the orders */
  totalOrders = computed(() => this.orders().length);

  /* Filter all order.status with pending and find out how many there are */
  pendingOrders = computed(() =>
    this.orders().filter(order => order.status === 'pending').length
  );

  /* Find the sum of all order totals */
  totalRevenue = computed(() => this.orders().reduce((sum, order) => sum + order.total, 0));


  constructor() {
    this.syncFromStore();

    fromEvent(window, this.orderEvents.eventName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.syncFromStore());

  }

  createOrder(order: Order): void {
    this.orderEvents.createOrder(order);
  }

  private syncFromStore(): void {
    const state = this.orderEvents.getState();
    this.orders.set(state.recentOrders);
  }

}
