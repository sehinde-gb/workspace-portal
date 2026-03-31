import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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



  editOrder(updatedOrder: Order): Observable<OrdersState | null> {
      // Grab the current state
      const current = this.getState();

      // 1. Find the old version of this order
      const oldOrder = current.recentOrders.find(o =>
        o.id === updatedOrder.id

      );

      // EDGE CASE: If the order doesn't exist, stop hereu'd subtract from old status and add to new.
      // If the oldOrder is not there it is returned and since this is an early return it is returned as a null value.
      if(!oldOrder) return of(null);
      /* The stream returns to
      // 2. INSIDE ONSUBMIT()
       this.ordersService.editOrder(updatedOrder).subscribe({
         next: (response) => {
      <--- 'response' IS NOW NULL HERE
      */


      // 3. Create the new array using .map()
      // This uses the 'updatedOrder' passed into the function
      const nextOrders = current.recentOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o);

      const nextState: OrdersState = {
        recentOrders: nextOrders,
        stats: {
          ...current.stats,
          // Note: totalOrders stays the same because we didn't add/remove a row
          totalOrders: current.stats.totalOrders,
          pendingOrders: nextOrders.filter(o => o.status === 'pending').length,
          completedOrders: nextOrders.filter(o => o.status === 'completed').length

        }
    };

    this.saveState(nextState, true);

    // 2. CRITICAL: Actually return the observable wrapped in an object to onSubmit()
    // next: (response) => {
    //  <--- 'response' IS NOW NULL HERE
    return of(nextState);

    }


  deleteOrder(orderId: number): void {
     // get current state
     const current = this.getState();
     // Find the orderId of the order that is destined for deletion
     const orderToDelete = current.recentOrders.find(order => order.id === orderId);

     // If doesnt exist return
     if (!orderToDelete) {
        return;
     }


    const nextState: OrdersState = {
      // using the ordeId filter through and remove the above ID from the orders collection.
      recentOrders: current.recentOrders.filter(order => orderId !== order.id),
      stats: {
        ...current.stats,
        // update stats by subtracting 1 from each signal
        totalOrders: Math.max(0, current.stats.totalOrders -1 ),
        pendingOrders:
          orderToDelete.status === 'pending'
            ? Math.max(0, current.stats.pendingOrders -1)
            : current.stats.pendingOrders,
        completedOrders:
          orderToDelete.status === 'completed'
            ? Math.max(0, current.stats.completedOrders -1 )
            : current.stats.completedOrders
      }
    };
    // save state
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





