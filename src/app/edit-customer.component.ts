import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { OrderEventsService } from 'shared-events';
import { notBlankValidator } from './core/validators/not-blank.validator';
import { emailuniqueValidator } from './core/validators/email-unique.validator';


@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `...`
})
export class EditCustomerComponent {

  // inject service
  private customerService = inject(OrderEventsService);

  // inject router
  private router = inject(Router);

  customerForm = new FormGroup({
    name: new FormControl('freddy', {
      nonNullable: true,
      validators: [Validators.required, notBlankValidator()]
    }),
    email: new FormControl('freddy@example.com', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
      asyncValidators: [emailuniqueValidator(this.customerService)],
      updateOn: 'blur'
    }),
    status: new FormControl<'active' | 'inactive'>('active', {
      nonNullable: true })
  });
}
