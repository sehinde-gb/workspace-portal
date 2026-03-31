import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CreateOrderComponent } from "./create-order.component";
import { OrdersFacade } from "../../../app/orders.facade";
import { Order } from "shared-data";

describe('CreateOrderComponent', () => {
  let fixture: ComponentFixture<CreateOrderComponent>;
  let component: CreateOrderComponent;
  let facade: jasmine.SpyObj<OrdersFacade>;

  beforeEach(async () => {
    facade = jasmine.createSpyObj('OrdersFacade', ['createOrder']);

    await TestBed.configureTestingModule({
      imports: [CreateOrderComponent],
      providers: [
        { provide: OrdersFacade, useValue: facade }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*

  setup => validate => submit => reset

  The pattern for form tests

    For a create form like CreateOrderComponent, think in 4 buckets:

    1. Form setup

    Does the form exist with the right default values?

    2. Validation

    Is the form invalid when values are wrong, and valid when values are right?

    3. Submit behavior

    What happens when the user submits:
      •	valid form
      •	invalid form

    4. Post-submit behavior

    What happens after success:
      •	reset form
      •	clear fields
      •	maybe show message or navigate


    A reusable checklist

  When testing a create form, ask:

  Form shape
    •	Does the form exist?
    •	Are defaults correct?

  Validation
    •	What makes it invalid?
    •	What makes it valid?

  Submission
    •	Does valid submit call the right dependency?
    •	Does invalid submit block submission?

  UX after submit
    •	Are fields reset?
    •	Are controls touched when invalid


  */


  it('creates the form with default values', () => {
    expect(component.orderForm).toBeTruthy();
    expect(component.orderForm.get('customerName')?.value).toBe('');
    expect(component.orderForm.get('total')?.value).toBe(0);
    expect(component.orderForm.get('status')?.value).toBe('pending');

  });


  it('is invalid when required fields are empty or invalid', () => {
    component.orderForm.setValue({
      customerName: '',
      total: 0,
      status: 'pending'
    });

    expect(component.orderForm.invalid).toBeTrue();
    expect(component.orderForm.get('customerName')?.hasError('required')).toBeTrue();
    expect(component.orderForm.get('total')?.hasError('min')).toBeTrue();
  });

  it('is valid with correct values', () => {
    component.orderForm.setValue({
      customerName: 'Acme Ltd',
      total: 120,
      status: 'pending'
    });

    expect(component.orderForm.valid).toBeTrue();
  });

  it('calls facade.createOrder when form is submitted with valid data', () => {
    component.orderForm.setValue({
      customerName: 'Acme Ltd',
      total: 120,
      status: 'pending'
    });

    component.submit();
    expect(facade.createOrder).toHaveBeenCalled();
  });

  it('does not call facade.createOrder when form is invalid', () => {
    component.orderForm.setValue({
      customerName: '',
      total: 0,
      status: 'pending'
    });

    component.submit();
    expect(facade.createOrder).not.toHaveBeenCalled();
  });


  it('marks all controls as touched when invalid form is submitted', () => {
    component.submit();

    expect(component.orderForm.get('customerName')?.touched).toBeTrue();
    expect(component.orderForm.get('total')?.touched).toBeTrue();
    expect(component.orderForm.get('status')?.touched).toBeTrue();
  });

  it('calls facade.createOrder when form is submitted from the DOM', () => {
    const customerInput: HTMLInputElement = fixture.nativeElement.querySelector('#customerName');
    const totalInput: HTMLInputElement = fixture.nativeElement.querySelector('#total');
    const statusSelect: HTMLSelectElement = fixture.nativeElement.querySelector('#status');
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');

    customerInput.value = 'Acme Ltd';
    customerInput.dispatchEvent(new Event('input'));

    totalInput.value = '2';
    totalInput.dispatchEvent(new Event('input'));

    statusSelect.value = 'pending';
    statusSelect.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    expect(component.orderForm.valid).toBeTrue();

    form.dispatchEvent(new Event('submit'));


    fixture.detectChanges();
    expect(facade.createOrder).toHaveBeenCalled();



  });

  it('resets the form after successful submit', () => {
    component.orderForm.setValue({
      customerName: 'Acme Ltd',
      total: 120,
      status: 'pending'
    });

    component.submit();

    expect(component.orderForm.get('customerName')?.value).toBe('');
    expect(component.orderForm.get('total')?.value).toBe(0);
    expect(component.orderForm.get('status')?.value).toBe('pending');
  });

  it('shows validation message when customer name is touched and empty', () => {
    const customerInput: HTMLInputElement =
      fixture.nativeElement.querySelector('#customerName');

      customerInput.value = '';
      customerInput.dispatchEvent(new Event('input'));
      customerInput.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Customer name is required');
  });


  it('shows total validation message when total is 0 and control is touched', () => {
  const totalInput: HTMLInputElement =
    fixture.nativeElement.querySelector('#total');

  totalInput.value = '0';
  totalInput.dispatchEvent(new Event('input'));
  totalInput.dispatchEvent(new Event('blur'));

  fixture.detectChanges();

  expect(fixture.nativeElement.textContent).toContain('Total must be greater than 0.');
});

});



