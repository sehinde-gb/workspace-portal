import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Order } from 'shared-data';
import { OrderCardComponent } from './order-card.component';

describe('OrderCardComponent', () => {
  let component: OrderCardComponent;
  let fixture: ComponentFixture<OrderCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCardComponent);
    component = fixture.componentInstance;

  });

  /*
    Render / UI State
  */
    it('renders customer name', () => {
      component.order = {
        id: 1,
        customerName: 'Acme Ltd',
        total: 120,
        status: 'pending'
      } as Order;

      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Acme Ltd');
    });

    it('renders total', () => {
      component.order = {
        id: 1,
        customerName: 'Acme Ltd',
        total: 120,
        status: 'pending'
      } as Order;

      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('120');
    });

    it('renders status', () => {
       component.order = {
          id: 1,
          customerName: 'Acme Ltd',
          total: 120,
          status: 'pending'
      } as Order;

      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('pending');
    });
});
