import { TestBed } from '@angular/core/testing';
import { OrdersFacade } from './orders.facade';
import { OrderEventsService } from 'shared-events';
import { Order } from 'shared-data';

describe('OrdersFacade', () => {
  let facade: OrdersFacade;
  let orderEvents: jasmine.SpyObj<OrderEventsService>;

  const mockOrder: Order = {
    id: 1,
    customerName: 'Test Customer',
    total: 100,
    status: 'pending'
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj(
      'OrderEventsService',
      ['getState', 'createOrder'],
      { eventName: 'ordersUpdated' }
    );

    TestBed.configureTestingModule({
      providers: [
        OrdersFacade,
        { provide: OrderEventsService, useValue: spy }
      ]
    });

    orderEvents = TestBed.inject(OrderEventsService) as jasmine.SpyObj<OrderEventsService>;
  });

  it('loads initial orders from store on init', () => {
    orderEvents.getState.and.returnValue({
      recentOrders: [mockOrder],
      stats: { totalOrders: 1, pendingOrders: 0, completedOrders: 0 }
    });

    facade = TestBed.inject(OrdersFacade);

    let emittedOrders: Order[] = [];
    facade.orders$.subscribe(orders => {
      emittedOrders = orders;
    });

    expect(orderEvents.getState).toHaveBeenCalled();
    expect(emittedOrders.length).toBe(1);
    expect(emittedOrders[0].customerName).toBe('Test Customer');
  });

  it('updates orders when event is fired', () => {
    orderEvents.getState.and.returnValues(
      {
        recentOrders: [],
        stats: { totalOrders: 0, pendingOrders: 0, completedOrders: 0 }
      },
      {
        recentOrders: [mockOrder],
        stats: { totalOrders: 1, pendingOrders: 0, completedOrders: 0 }
      }
    );

    facade = TestBed.inject(OrdersFacade);

    let emittedOrders: Order[] = [];
    facade.orders$.subscribe(orders => {
      emittedOrders = orders;
    });

    expect(emittedOrders.length).toBe(0);

    window.dispatchEvent(new Event(orderEvents.eventName));

    expect(emittedOrders.length).toBe(1);
    expect(emittedOrders[0].customerName).toBe('Test Customer');
  });

  it('delegates createOrder to the service', () => {
    orderEvents.getState.and.returnValue({
      recentOrders: [],
      stats: { totalOrders: 0, pendingOrders: 0, completedOrders: 0 }
    });

    facade = TestBed.inject(OrdersFacade);

    facade.createOrder(mockOrder);

    expect(orderEvents.createOrder).toHaveBeenCalledWith(mockOrder);
  });
});
