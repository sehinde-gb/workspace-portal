import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { OrderEventsService } from 'shared-events';
import { Order } from '../../../shared-data/src/lib/models/order';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let orderEvents: OrderEventsService

 beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule // ✅ THIS is the key fix
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    orderEvents = TestBed.inject(OrderEventsService);
    /*
    The service is recreated per test via TestBed,
      which resets stats to initial values (24/5/19) */
  });

  /*
    Render / UI State
  */
  it('renders dashboard title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Dashboard Remote');
  });

  it('loads stats from shared state on init', () => {
    fixture.detectChanges();

    expect(component.stats.totalOrders).toBe(24);
    expect(component.recentOrders.length).toBe(3);
  });

  /*
    Success paths
  */
  it('updates dashboard stats when an order is created', () => {
    fixture.detectChanges();

    const newOrder: Order = {
        id: 99,
        customerName: 'New Customer',
        total: 250,
        status: 'pending'
      };

      orderEvents.createOrder(newOrder);

      window.dispatchEvent(new CustomEvent(orderEvents.eventName));
      fixture.detectChanges();

      expect(component.stats.totalOrders).toBe(25);
      expect(component.stats.pendingOrders).toBe(6);
      expect(component.recentOrders[0].customerName).toBe('New Customer');

  });

});
