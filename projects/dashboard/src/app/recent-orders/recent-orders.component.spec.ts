import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Order } from 'shared-data';
import { RecentOrdersComponent } from './recent-orders.component';

describe('RecentOrdersComponent', () => {
  let component: RecentOrdersComponent;
  let fixture: ComponentFixture<RecentOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentOrdersComponent);
    component = fixture.componentInstance;

  });

  /*
    Render / UI State
  */

  it('renders heading', () => {
    component.orders = [];
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Recent Orders');
  });

  it('renders orders when provided', () => {
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
     } as Order
    ];
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Acme Ltd');
    expect(fixture.nativeElement.textContent).toContain('Globex Corp');
  });

  /*
    Edge cases
  */
 it('renders empty state when orders are empty', () => {
  component.orders = [];
  fixture.detectChanges();

  expect(fixture.nativeElement.textContent).toContain('No recent orders available.');
 });
});
