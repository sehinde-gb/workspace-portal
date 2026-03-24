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
  let facade: jasmine.SpyObj<OrdersFacade> & { orders: Signal<Order[]> };

  beforeEach(async () => {
    const facadeSpy = jasmine.createSpyObj('OrdersFacade', ['createOrder']);
    facade = Object.assign(facadeSpy, {
      orders: signal([
        { id: 1, customerName: 'Test User', total: 100, status: 'pending' }
      ] as Order[])
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

  it('calls facade when button is clicked', () => {
    fixture.detectChanges();

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();

    expect(facade.createOrder).toHaveBeenCalled();
  });

  it('renders computed order stats', () => {
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Total Orders: 1');
    expect(text).toContain('Pending Orders: 1');
  });
});
