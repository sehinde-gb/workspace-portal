import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditOrderComponent } from "./edit-order.component";
import { OrderEventsService } from '../../../../../../shared-events/src/lib/order-events.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Order } from "shared-data";
import { of } from 'rxjs';


describe('EditOrderComponent (container)', () => {
  let fixture: ComponentFixture<EditOrderComponent>;
  let component: EditOrderComponent;
  let OrderEventsServiceSpy: jasmine.SpyObj<OrderEventsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeId = '1';



  const mockOrder: Order = {
    id: 1,
    customerName: 'Old Customer',
    total: 200,
    status: 'pending'
  };


  beforeEach(async () => {
    OrderEventsServiceSpy = jasmine.createSpyObj<OrderEventsService>('OrderEventsService', ['getState', 'editOrder']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl', 'navigate'], {
      url: 'orders/edit/1'
    });

    await TestBed.configureTestingModule({
      // configure environment with dependency injections
      imports: [EditOrderComponent],
      providers: [
        {
        provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'id' ? routeId: null
              }
            }
          }
          },
        { provide: OrderEventsService, useValue: OrderEventsServiceSpy},
        { provide: Router, useValue: routerSpy}
      ],
    })
    .compileComponents();

    // Create component
    fixture = TestBed.createComponent(EditOrderComponent);
    component = fixture.componentInstance;
  })


    /* Testing

    1. Does the form exist ?
    2. Does it load the existing order values in to the form ?
    3. Does it become invalid / valid correctly ?
    4. Submit behaviour
      Does valid submit updateOrder with the edited data?
      Does invalid block submission ?
    5. Post submit behaviour does it keep id and merge udpated values correctly ?
    does it reset or navigate
    */


  it('loads existing order values into the form', () => {
    routeId = '1';

    // Arrange
    OrderEventsServiceSpy.getState.and.returnValue({
        recentOrders: [mockOrder],
      stats: {
        totalOrders: 1,
        pendingOrders: 1,
        completedOrders: 0
      }});


    // Act
    fixture.detectChanges();


    // Assert
    expect(component.orderForm.get('customerName')?.value).toBe('Old Customer');
    expect(component.orderForm.get('total')?.value).toBe(200);
    expect(component.orderForm.get('status')?.value).toBe('pending');
    expect(component.hasError()).toBeFalse();


  });

  it('shows error when id is missing or invalid', () => {

    routeId = '';

     // Arrange
    OrderEventsServiceSpy.getState.and.returnValue({
        recentOrders: [mockOrder],
      stats: {
        totalOrders: 1,
        pendingOrders: 1,
        completedOrders: 0
      }});

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.hasError()).toBeTrue();

  });

  it('shows error when order is not found', () => {

    routeId = '109';

     // Arrange
    OrderEventsServiceSpy.getState.and.returnValue({
        recentOrders: [mockOrder],
      stats: {
        totalOrders: 1,
        pendingOrders: 1,
        completedOrders: 0
      }});

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.hasError()).toBeTrue();


  });



  it('calls editOrder with updated values on valid submission', () => {
    routeId = '1';

    OrderEventsServiceSpy.getState.and.returnValue({
      recentOrders: [mockOrder],
      stats: {
        totalOrders: 1,
        pendingOrders: 1,
        completedOrders: 0
      }
    });

    OrderEventsServiceSpy.editOrder.and.returnValue(of({
      recentOrders: [
        { id: 1, customerName: 'New Customer', total: 300, status: 'completed' }
      ],
      stats: {
        totalOrders: 1,
        pendingOrders: 0,
        completedOrders: 1
      }
    }));

    fixture.detectChanges();

    component.orderForm.setValue({
      customerName: 'New Customer',
      total: 300,
      status: 'completed'
    });

    component.onSubmit();

    expect(component.hasError()).toBeFalse();
    expect(OrderEventsServiceSpy.editOrder).toHaveBeenCalledWith({
      id: 1,
      customerName: 'New Customer',
      total: 300,
      status: 'completed'
    });
  });
  

  it('does not call editOrder on invalid submit', () => {
    // Arrange
    routeId = '1';

    OrderEventsServiceSpy.getState.and.returnValue({
      recentOrders: [mockOrder],
      stats: {
        totalOrders: 1,
        pendingOrders: 1,
        completedOrders: 0
      }
    });

    // Act
    fixture = TestBed.createComponent(EditOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.orderForm.setValue({
      customerName: '',
      total: 0,
      status: 'pending'
    });

    component.onSubmit();

    // Assert
    expect(component.orderForm.invalid).toBeTrue();
    expect(OrderEventsServiceSpy.editOrder).not.toHaveBeenCalled();
  });


  it('marks controls touched on invalid submit', () => {
    routeId = '1';

    OrderEventsServiceSpy.getState.and.returnValue({
      recentOrders: [mockOrder],
      stats: {
        totalOrders: 1,
        pendingOrders: 1,
        completedOrders: 0
      }
    });

    fixture.detectChanges();

    component.orderForm.setValue({
      customerName: '',
      total: 0,
      status: 'pending'
    });

    component.onSubmit();

    expect(component.orderForm.get('customerName')?.touched).toBeTrue();
    expect(component.orderForm.get('total')?.touched).toBeTrue();
    expect(component.orderForm.get('status')?.touched).toBeTrue();
  });
})

