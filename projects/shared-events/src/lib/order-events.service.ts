import { Injectable } from '@angular/core';
import { DashboardStats, Order } from 'shared-data';

export interface OrdersState {
  recentOrders: Order[];
  stats: DashboardStats;
}

@Injectable({
  providedIn: 'root'
})
export class OrderEventsService {
  private readonly storageKey = 'workspace-portal-orders-state';
  private readonly updateEventName = 'workspace-portal-orders-updated';

  private readonly initialState: OrdersState = {
    recentOrders: [
      { id: 1, customerName: 'Acme Ltd', total: 120, status: 'pending' },
      { id: 2, customerName: 'Globex Corp', total: 320, status: 'completed' },
      { id: 3, customerName: 'Soylent Ltd', total: 210, status: 'cancelled' }
    ],
    stats: {
      totalOrders: 24,
      pendingOrders: 5,
      completedOrders: 19
    }
  };

  getState(): OrdersState {
    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      this.saveState(this.initialState, false);
      return this.initialState;
    }

    return JSON.parse(raw) as OrdersState;
  }

  createOrder(order: Order): void {
    const current = this.getState();

    const nextState: OrdersState = {
      /*
      Add the order retrieved from the local state to the recent orders array and it includes
      only the first 5 orders the slice determines this.
      */
      recentOrders: [order, ...current.recentOrders].slice(0, 5),
      stats: {
        /* Update the stats with the updated orders and either increment by 1 or not
        then change the status to pending and completed.
        */
        ...current.stats,
        totalOrders: current.stats.totalOrders + 1,
        pendingOrders:
          order.status === 'pending'
            ? current.stats.pendingOrders + 1
            : current.stats.pendingOrders,
        completedOrders:
          order.status === 'completed'
            ? current.stats.completedOrders + 1
            : current.stats.completedOrders
      }
    };

    this.saveState(nextState, true);
  }

  get eventName(): string {
    return this.updateEventName;
  }

  private saveState(state: OrdersState, emitEvent: boolean): void {
    localStorage.setItem(this.storageKey, JSON.stringify(state));

    if (emitEvent) {
      window.dispatchEvent(new CustomEvent(this.updateEventName, { detail: state }));
    }
  }
}
