import { Component, Input } from '@angular/core';
import { DashboardStats } from 'shared-data';
import { InfoCardComponent } from 'shared-ui';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [InfoCardComponent],
  templateUrl: './dashboard-stats.component.html',
  styleUrl: './dashboard-stats.component.scss'
})
export class DashboardStatsComponent {
  @Input({ required: true}) stats!: DashboardStats;
}
