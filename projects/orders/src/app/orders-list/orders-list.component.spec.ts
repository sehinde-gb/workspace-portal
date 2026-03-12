import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Order } from 'shared-data';
import { OrdersListComponent } from './orders-list.component';

describe('OrdersListComponent', () => {
  let component: OrdersListComponent;
  let fixture: ComponentFixture<OrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersListComponent);
    component = fixture.componentInstance;

  });
/*
  Render / UI State
*/
  it('renders empty state when orders is empty', () => {
    component.orders = [];
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No orders available yet.');
  });

  it('renders order cards when orders exist', () => {
    component.orders = [
      {
        id: 1,
        customerName: 'Acme Ltd',
        total: 120,
        status: 'pending'
      } as Order,
      {
        id: 2,
        customerName: 'Globex Corp',
        total: 320,
        status: 'completed'
      } as Order,
    ];

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Acme Ltd');
    expect(fixture.nativeElement.textContent).toContain('Globex Corp');
  });
});
