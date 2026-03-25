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
      ['getState', 'createOrder', 'deleteOrder'],
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

  afterEach(() => {
    orderEvents.getState.calls.reset();
    orderEvents.createOrder.calls.reset();
  });

  it('loads initial orders from store on init', () => {
    orderEvents.getState.and.returnValue({
      recentOrders: [mockOrder],
      stats: { totalOrders: 1, pendingOrders: 1, completedOrders: 0 }
    });

    facade = TestBed.inject(OrdersFacade);

    expect(orderEvents.getState).toHaveBeenCalled();
    expect(facade.orders().length).toBe(1);
    expect(facade.orders()[0].customerName).toBe('Test Customer');
  });

  /* Edge Case */
  it('updates orders when event is fired', () => {
    orderEvents.getState.and.returnValues(
      {
        recentOrders: [],
        stats: { totalOrders: 0, pendingOrders: 0, completedOrders: 0 }
      },
      {
        recentOrders: [mockOrder],
        stats: { totalOrders: 1, pendingOrders: 1, completedOrders: 0 }
      }
    );

    facade = TestBed.inject(OrdersFacade);

    expect(facade.orders().length).toBe(0);

    window.dispatchEvent(new Event(orderEvents.eventName));

    expect(facade.orders().length).toBe(1);
    expect(facade.orders()[0].customerName).toBe('Test Customer');
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


  it('sets error when getState throws', () => {
    orderEvents.getState.and.throwError('failure');

    facade = TestBed.inject(OrdersFacade);

    expect(facade.error()).toBe('Failed to load orders');
    expect(facade.loading()).toBe(false);
  });



  /* Success */
  it('optimistically adds order before calling service', () => {
    orderEvents.getState.and.returnValue({
      recentOrders: [],
      stats: { totalOrders: 0, pendingOrders: 0, completedOrders: 0 }
    });

    facade = TestBed.inject(OrdersFacade);

    const newOrder: Order = {
      id: 99,
      customerName: 'Optimistic Customer',
      total: 250,
      status: 'pending'
    };

    facade.createOrder(newOrder);

    expect(facade.orders().length).toBe(1);
    expect(facade.orders()[0].customerName).toBe('Optimistic Customer');
    expect(orderEvents.createOrder).toHaveBeenCalledWith(newOrder);
    expect(facade.error()).toBeNull();

  });

  /* Failure */
  it('computes total orders and pending orders from orders state', () => {
    orderEvents.getState.and.returnValue({
      recentOrders: [
        { id: 1, customerName: 'A', total: 100, status: 'pending'},
        { id: 2, customerName: 'B', total: 200, status: 'completed'},
        { id: 3, customerName: 'C', total: 300, status: 'pending'},
      ],
      stats: { totalOrders: 3, pendingOrders: 2, completedOrders: 1 }
    });
    facade = TestBed.inject(OrdersFacade);

    expect(facade.totalOrders()).toBe(3);
    expect(facade.pendingOrders()).toBe(2);
    expect(facade.totalRevenue()).toBe(600);
  });

  it('sets error when getState throws', () => {
    orderEvents.getState.and.throwError('failure');

    facade = TestBed.inject(OrdersFacade);

    expect(facade.error()).toBe('Failed to load orders');
    expect(facade.loading()).toBe(false);
  });

  it('sets loading to false after successful sync', () => {
    orderEvents.getState.and.returnValue({
      recentOrders: [],
      stats: { totalOrders: 0, pendingOrders: 0, completedOrders: 0 }
    });

    facade = TestBed.inject(OrdersFacade);

    expect(facade.loading()).toBe(false);
    expect(facade.error()).toBeNull();
  });

  it('rolls back optimistic update when createOrder fails', () => {
    const existingOrder: Order = {
      id: 1,
      customerName: 'Existing Customer',
      total: 100,
      status: 'pending'
    };

    orderEvents.getState.and.returnValue({
      recentOrders: [existingOrder],
      stats: {totalOrders: 1, pendingOrders: 1, completedOrders: 0 }
    });

    facade = TestBed.inject(OrdersFacade);

    const newOrder: Order = {
      id: 99,
      customerName: 'Optimistic Customer',
      total: 250,
      status: 'pending'
    };

    orderEvents.createOrder.and.throwError('create failed');

    facade.createOrder(newOrder);

    expect(facade.orders().length).toBe(1);
    expect(facade.orders()[0].customerName).toBe('Existing Customer');
    expect(facade.error()).toBe('Failed to create order');
  });

  it('optimistically remove order before calling delete service', () => {
    const existingOrders: Order[] = [
      { id: 1, customerName: 'A', total: 100, status: 'pending'},
      { id: 2, customerName: 'B', total: 200, status: 'completed'},
    ];

    orderEvents.getState.and.returnValue({
      recentOrders: existingOrders,
      stats: { totalOrders: 2, pendingOrders: 1, completedOrders: 1 }

    });

    facade = TestBed.inject(OrdersFacade);

    facade.deleteOrder(existingOrders[0]);

    expect(facade.orders().length).toBe(1);
    expect(facade.orders()[0].customerName).toBe('B');
    expect(orderEvents.deleteOrder).toHaveBeenCalledWith(1);
    expect(facade.error()).toBeNull();
  });

  it('rollsback optimistic delete when service fails', () => {
    const existingOrders: Order[] = [
      { id: 1, customerName: 'A', total: 100, status: 'pending' },
      { id: 2, customerName: 'B', total: 200, status: 'completed'}
    ];

    orderEvents.getState.and.returnValue({
      recentOrders: existingOrders,
      stats: { totalOrders: 2, pendingOrders: 1, completedOrders: 1 }
    });

    orderEvents.deleteOrder.and.throwError('delete failed');

    facade = TestBed.inject(OrdersFacade);

    facade.deleteOrder(existingOrders[0]);

    expect(facade.orders().length).toBe(2);
    expect(facade.orders()[0].customerName).toBe('A');
    expect(facade.error()).toBe('Failed to delete order')
  });

});
