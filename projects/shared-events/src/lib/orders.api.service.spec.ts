import { Order } from "shared-data";
import { OrdersApiService } from "./orders-api-service";
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";



describe('OrdersApiService', () =>{
  let service: OrdersApiService;
  let httpMock: HttpTestingController;


  const mockOrders: Order[] = [
    { id: 1, customerName: 'Acme Ltd', total: 120, status: 'pending' },
    { id: 1, customerName: 'Globex Ltd', total: 302, status: 'completed'}
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrdersApiService,
        provideHttpClient(),
        provideHttpClientTesting()

      ]
    });

    service = TestBed.inject(OrdersApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

// Checks to see if no outstanding requests
  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch orders with GET', () => {
    let actualOrders: Order[] = [];

    service.getOrders().subscribe(orders => {
      actualOrders = orders;

    });

    const req = httpMock.expectOne('/api/orders');

    expect(req.request.method).toBe('GET');

    // sends mockOrders to the observable
    req.flush(mockOrders);

    expect(actualOrders.length).toBe(2);
    expect(actualOrders[0].customerName).toBe('Acme Ltd');
  });


  it('should create order with POST', () => {
    const newOrder: Order = {
      id: 3,
      customerName: 'Soylent Ltd',
      total: 210,
      status: 'pending'
    };

    let createdOrder: Order | undefined;

    service.createOrder(newOrder).subscribe(order => {
      createdOrder = order;
    });

    // Intercepts the http request
    const req = httpMock.expectOne('/api/orders');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newOrder);

    // sends newOrder to the observable
    req.flush(newOrder);

    expect(createdOrder).toEqual(newOrder);
  });


  it('should delete order with DELETE', () => {
    service.deleteOrder(1).subscribe();

    const req = httpMock.expectOne('/api/orders/1');

    expect(req.request.method).toBe('DELETE');

    // sends null to the observable
    req.flush(null);
  });

  it('should handle HTTP error', () => {
    let errorResponse: string | undefined;

    service.getOrders().subscribe({
      next: () => fail('expected an error'),
      error: err => {
        errorResponse = err.statusText;
      }
    });

    const req = httpMock.expectOne('/api/orders');
    // sends error to the observable
    req.flush('Failed request', { status: 500, statusText: 'Server Error' });

    expect(errorResponse).toBe('Server Error');
  });


});
