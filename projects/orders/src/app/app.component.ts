import { Component } from '@angular/core';
import { InfoCardComponent, PageHeaderComponent } from 'shared-ui';
import { Order } from 'shared-data';
import { OrdersListComponent } from "./orders-list/orders-list.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PageHeaderComponent, InfoCardComponent, OrdersListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  orders: Order[] = [
    {
      id: 1,
      customerName: 'Acme Ltd',
      total: 120,
      status: 'pending',
    },
    {
      id: 2,
      customerName: 'Globex Corp',
      total: 320,
      status: 'completed'
    }

  ];
}
