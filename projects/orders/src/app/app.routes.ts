import { Routes } from '@angular/router';
import { EditOrderComponent } from '../features/orders/components/edit/edit-order.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./app.component').then((m) => m.AppComponent),
  },

  { path: 'orders/edit/:id', component: EditOrderComponent}
];
