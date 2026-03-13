import { Component, DestroyRef, inject, OnDestroy } from '@angular/core';
import { DashboardStats, Order } from 'shared-data';
import { PageHeaderComponent } from 'shared-ui';
import { DashboardStatsComponent } from "./dashboard-stats/dashboard-stats.component";
import { RecentOrdersComponent } from './recent-orders/recent-orders.component';
import { OrderEventsService } from 'shared-events';
import { takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PageHeaderComponent,  DashboardStatsComponent, RecentOrdersComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
    /*
  private orderEvents = inject(OrderEventsService);
  private destroyRef = inject(DestroyRef);

  stats: DashboardStats = {
    totalOrders: 24,
    pendingOrders: 5,
    completedOrders: 19
  };

  recentOrders: Order[] = [];

 constructor() {
    console.log('[Dashboard] OrderEventService instance', this.orderEvents.instanceId);


    this.orderEvents.stats$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((stats) => {
        console.log('[Dashboard] stats update', this.orderEvents.instanceId, stats);
        this.stats = stats;
      });

    this.orderEvents.orders$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((orders) => {
        console.log('[Dashboard] orders update', this.orderEvents.instanceId, orders);
        this.recentOrders = orders;
      });
  } */

      private orderEvents = inject(OrderEventsService);
      private destroyRef = inject(DestroyRef);

      stats: DashboardStats = {
        totalOrders: 24,
        pendingOrders: 5,
        completedOrders: 19
      };
      recentOrders: Order[] = [];

      constructor() {
          console.log('[Dashboard] subscribed with instance', this.orderEvents.instanceId);

          this.orderEvents.stats$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((stats) => {
              console.log('[Dashboard] stats update', this.orderEvents.instanceId, stats);
              this.stats = stats;
            });

          this.orderEvents.orders$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((orders) => {
              console.log('[Dashboard] orders update', this.orderEvents.instanceId, orders);
              this.recentOrders = orders;
            });
      }

      ngOnDestroy(): void {
        console.log('[Dashboard] destroyed', this.orderEvents.instanceId);
      }
}
