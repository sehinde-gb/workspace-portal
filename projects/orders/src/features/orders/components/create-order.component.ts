import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersFacade } from '../../../app/orders.facade';
import { Order } from 'shared-data';
import { cancelledOrderTotalValidator } from '../../../app/core/validators/cancelled-order-total.validator';



@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.scss'
})

export class CreateOrderComponent {
  private fb = inject(FormBuilder);
  private facade = inject(OrdersFacade);


  orderForm = new FormGroup(
  {
    customerName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), notBlankValidator()]
    }),
    total: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)]
    }),
    status: new FormControl<Order['status']>('pending', {
      nonNullable: true,
      validators: [Validators.required]
    })
  },
  { validators: [cancelledOrderTotalValidator()] }
  );

  submit(): void {
    if(this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const value = this.orderForm.getRawValue();

    const newOrder: Order = {
      id: Date.now(),
      customerName: value.customerName ?? '',
      total: value.total ?? 0,
      status: value.status as Order['status']
    };

    this.facade.createOrder(newOrder);

    this.orderForm.reset({
      customerName: '',
      total: 0,
      status: 'pending'
    });
  }




}
