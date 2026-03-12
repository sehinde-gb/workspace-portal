import { Component } from '@angular/core';
import { DashboardStats, Order } from 'shared-data';
import { PageHeaderComponent } from 'shared-ui';
import { DashboardStatsComponent } from "./dashboard-stats/dashboard-stats.component";
import { RecentOrdersComponent } from './recent-orders/recent-orders.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PageHeaderComponent,  DashboardStatsComponent, RecentOrdersComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  stats: DashboardStats = {
    totalOrders: 24,
    pendingOrders: 5,
    completedOrders: 19
  };

  recentOrders: Order[] = [
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
}
