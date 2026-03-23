import { Injectable, inject, DestroyRef } from "@angular/core";
import { BehaviorSubject, fromEvent } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { OrderEventsService } from "shared-events";
import { Order } from "shared-data";

@Injectable({ providedIn: 'root'})

export class OrdersFacade {
  private orderEvents = inject(OrderEventsService);
  private destroyRef = inject(DestroyRef);

  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

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
    this.ordersSubject.next(state.recentOrders);
  }

}
