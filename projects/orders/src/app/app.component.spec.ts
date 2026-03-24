import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Signal, signal } from '@angular/core';
import { AppComponent } from './app.component';
import { OrdersFacade } from './orders.facade';
import { provideRouter, Routes } from '@angular/router';
import { Order } from 'shared-data';

const mockRoutes: Routes = [];

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let facade: jasmine.SpyObj<OrdersFacade> & {
    orders: Signal<Order[]>
    loading: Signal<boolean>;
    error: Signal<string | null>;
    totalOrders: Signal<number>;
    pendingOrders: Signal<number>;
    totalRevenue: Signal<number>;
  };

  beforeEach(async () => {
    const facadeSpy = jasmine.createSpyObj('OrdersFacade', ['createOrder']);
    facade = Object.assign(facadeSpy, {
      orders: signal([
        { id: 1, customerName: 'Test User', total: 100, status: 'pending' }
      ] as Order[]),
      loading: signal(false),
      error: signal(null),
      totalOrders: signal(1),
      pendingOrders: signal(1),
      totalRevenue: signal(100)
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(mockRoutes),
        { provide: OrdersFacade, useValue: facade }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('renders orders title', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Orders Remote');
  });

  it('renders orders from facade', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Test User');
  });

  it('renders computed order stats', () => {
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Total orders: 1');
    expect(text).toContain('Pending orders: 1');
    expect(text).toContain('Total revenue: 100');
  });

  it('calls facade when button is clicked', () => {
    fixture.detectChanges();

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();

    expect(facade.createOrder).toHaveBeenCalled();
  });

  it('shows loading message when loading is true', () => {
    facade.loading.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Loading orders....');
  });

  it('shows error message when error exists', () => {
    facade.error.set('Failed to load orders');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Failed to load orders');
  });


});
