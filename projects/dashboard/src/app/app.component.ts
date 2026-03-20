import { Component, DestroyRef, inject, OnDestroy } from '@angular/core';
import { DashboardStats, Order } from 'shared-data';
import { PageHeaderComponent } from 'shared-ui';
import { DashboardStatsComponent } from "./dashboard-stats/dashboard-stats.component";
import { RecentOrdersComponent } from './recent-orders/recent-orders.component';
import { OrderEventsService } from 'shared-events';
import { takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PageHeaderComponent,  DashboardStatsComponent, RecentOrdersComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  {
  private orderEvents = inject(OrderEventsService);
  private destroyRef = inject(DestroyRef);

  stats: DashboardStats = {
    totalOrders: 24,
    pendingOrders: 5,
    completedOrders: 19
  };

  recentOrders: Order[] = [];

  constructor() {
     this.syncFromStore();

     fromEvent(window, this.orderEvents.eventName)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => this.syncFromStore());
  }

  private syncFromStore(): void {
    const state = this.orderEvents.getState();
    this.stats = state.stats;
    this.recentOrders = state.recentOrders;
  }

}
