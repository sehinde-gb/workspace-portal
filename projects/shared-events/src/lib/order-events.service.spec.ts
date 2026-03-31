import { TestBed } from "@angular/core/testing";
import { OrderEventsService, OrdersState } from './order-events.service';
import { Order } from "shared-data";

describe('OrderEventsService', () => {
  let service: OrderEventsService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [OrderEventsService]
    });

    service = TestBed.inject(OrderEventsService);

  });

  /* Render Initial State */

  it('returns initial state when storage is empty', () => {
    const state = service.getState();

    expect(state.recentOrders.length).toBe(3);
    expect(state.stats.totalOrders).toBe(24);
    expect(state.stats.pendingOrders).toBe(5);
    expect(state.stats.completedOrders).toBe(19);

  });


  /* Success paths */
  it('adds a new order to the top of recentOrders', () => {
    const newOrder: Order = {
      id: 99,
      customerName: 'New Customer',
      total: 250,
      status: 'pending'
    };

    service.createOrder(newOrder);

    const state = service.getState();

    expect(state.recentOrders[0].customerName).toBe('New Customer');
    expect(state.recentOrders.length).toBeLessThanOrEqual(5);
  });

  it('it should replace an existing order with updated details', () => {
    // ARRANGE
    const updatedOrder: Order = {
      id: 99,
      customerName: 'Old Customer',
      total: 250,
      status: 'pending'
    };

    const existingOrder: Order = {
      id: 99,
      customerName: 'New Customer Ltd',
      total: 300,
      status: 'completed'
    };

    // Manually set up the initial state
    const initialState: OrdersState = {
      recentOrders: [existingOrder],
      stats: { totalOrders: 1, pendingOrders: 1, completedOrders: 0 }
    };

    service.editOrder(updatedOrder);

    const finalState = service.getState();

    expect(finalState.recentOrders[0].customerName).toBe('New Customer Ltd');

    expect(finalState.stats.pendingOrders).toBe(0);

    expect(finalState.stats.completedOrders).toBe(1);

  });

  /* Edge Case */
  it('given an empty updated order it should not replace an existing order', () => {

    // ARRANGE
    const updatedOrder: Order = {
      id: 0,
      customerName: '',
      total: 0,
      status: 'pending'
    };

    const existingOrder: Order = {
      id: 99,
      customerName: 'New Customer Ltd',
      total: 300,
      status: 'completed'
    };


    // Manually set up the initial state
    const initialState: OrdersState = {
      recentOrders: [existingOrder],
      stats: { totalOrders: 0, pendingOrders: 0, completedOrders: 0 }
    };

    // ACT
    service.editOrder(updatedOrder);

    const finalState = service.getState();

    expect(finalState.recentOrders[0].customerName).toBeFalsy();

    expect(finalState.stats.pendingOrders).toBe(0);

    expect(finalState.stats.completedOrders).toBe(0);



  });

  it('increments pendingOrders when a pending order is created', () => {
    const newOrder: Order = {
      id: 99,
      customerName: 'New Customer',
      total: 250,
      status: 'pending'
    };

    service.createOrder(newOrder);

    const state = service.getState();

    expect(state.stats.pendingOrders).toBe(6);
  });

  it('increments completedOrders when a completed order is created', () => {
    const newOrder: Order = {
      id: 100,
      customerName: 'Completed Customer',
      total: 400,
      status: 'completed'
    };

    service.createOrder(newOrder);

    const state = service.getState();

    expect(state.stats.completedOrders).toBe(20);
  });

  it('dispatches the update event when a new order is created', () => {
    spyOn(window, 'dispatchEvent');

    const newOrder: Order = {
      id: 101,
      customerName: 'Event Customer',
      total: 180,
      status: 'pending'
    };

    service.createOrder(newOrder);

    expect(window.dispatchEvent).toHaveBeenCalled();
  });

});
