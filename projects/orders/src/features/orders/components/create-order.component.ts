import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersFacade } from '../../../app/orders.facade';
import { Order } from 'shared-data';

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

  orderForm = this.fb.group({
    customerName: ['', [Validators.required, Validators.minLength(2)]],
    total: [0, [Validators.required, Validators.min(1)]],
    status: ['pending', [Validators.required]]
  });

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
