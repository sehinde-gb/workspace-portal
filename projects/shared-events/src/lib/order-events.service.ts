import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DashboardStats, Order } from "shared-data";

@Injectable({
  providedIn: 'root'
})

export class OrderEventsService {
  readonly instanceId = Math.random().toString(36).slice(2);

  private readonly initialOrders: Order[] = [
    {
      id: 1,
      customerName: 'Acme Ltd',
      total: 120,
      status: 'pending'
    },
    {
      id: 2,
      customerName: 'Globex Corp',
      total: 320,
      status: 'completed'
    },
    {
      id: 3,
      customerName: 'Soylent Ltd',
      total: 210,
      status: 'cancelled'
    }
  ];

  private readonly initialStats: DashboardStats = {
    totalOrders: 24,
    pendingOrders: 5,
    completedOrders: 19
  };

  private ordersSubject = new BehaviorSubject<Order[]>(this.initialOrders);
  private statsSubject = new BehaviorSubject<DashboardStats>(this.initialStats);

  orders$ = this.ordersSubject.asObservable();
  stats$ = this.statsSubject.asObservable();

  createOrder(order: Order): void {
    const currentOrders = this.ordersSubject.getValue();
    const currentStats = this.statsSubject.getValue();

    console.log('[OrderEventsService:createOrder] instance', this.instanceId, order);

    /*
    order, ...currentOrders creates a new array and adds the new order at the top, the
    slice limits the sum of the orders to 5 in total.
    The new list is pushed in to the BehaviorSubject and emitted to the subscribers.
    */
    this.ordersSubject.next([order, ...currentOrders].slice(0, 5));

    // In the section below ? is ternary and is used as or in this case
    this.statsSubject.next({
      ...currentStats,
      totalOrders: currentStats.totalOrders + 1,
      pendingOrders:
        order.status === 'pending'
        ? currentStats.pendingOrders + 1
        : currentStats.pendingOrders,
      completedOrders:
        order.status === 'completed'
        ? currentStats.completedOrders + 1
        : currentStats.completedOrders
    });
  }
}
