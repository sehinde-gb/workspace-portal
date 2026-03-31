import { ApplicationConfig } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { CreateOrderComponent } from '../features/orders/components/create-order.component';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes,
    withRouterConfig({
      onSameUrlNavigation: 'reload'
    })
  )]
};
