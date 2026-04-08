import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Order } from "shared-data";
import { OrderEventsService } from "shared-events";
import { notBlankValidator } from "../../../../app/core/validators/not-blank.validator";



@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl:'./edit-order.component.html',
  styleUrl: './edit-order.component.scss'
})

export class EditOrderComponent implements OnInit {


  orderId!: number;
  route = inject(ActivatedRoute);
  router = inject(Router);
  ordersService = inject(OrderEventsService);


  currentOrder!: Order;


  // Build the form
  orderForm = new FormGroup({
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
  });

  hasError = signal(false);
  isSubmitting = signal(false);


  ngOnInit() {
    // Get the ID from the URL: /orders/edit/99 and assign it to orderId
    const id = this.route.snapshot.paramMap.get('id');
    this.orderId = Number(id);


    // Check to see if there is an error
    if (!this.orderId) {
      this.hasError.set(true);
      return;
    }

    // Grab the state and find the updated order
    const state = this.ordersService.getState();
    const order = state.recentOrders.find(o => o.id === this.orderId);

    // If there is an error set that to true
    if (!order) {
      this.hasError.set(true);
      return;
    }

    // set the current order and the error flag to false
    this.currentOrder = order;
    this.hasError.set(false);

    // Patch the values
    this.orderForm.patchValue({
      customerName: order.customerName,
      total: order.total,
      status: order.status
    });
  }

  goBack(): void {
    // if the form is dirty confirm leave
    if (this.orderForm.dirty) {
      const confirmLeave = confirm('You have unsaved changes. Leave anyway?');
      if(!confirmLeave){
        return;
      }
    }
     this.router.navigateByUrl('/orders');
  }

  retry(): void {
    this.hasError.set(false);

    // Requires onSameUrlNavigation: 'reload' app routes
    this.router.navigateByUrl(this.router.url);
  }

  onSubmit(): void {
    // if the form is not valid mark as touched
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched()
      return;
    }

    // If issubmitting is true then return
    if (this.isSubmitting()) {
      return;
    }


     this.isSubmitting.set(true);

     // getRawValue means that disabled fields are included in the data sent to the service
     const value = this.orderForm.getRawValue();

     // Prepare the updated order by adding it to the stack
     const updatedOrder: Order = {
      ...this.currentOrder,
      customerName: value.customerName,
      total: value.total,
      status: value.status
     };

     /* Updated order is passed to the service and the observable is result is returned using if(!oldOrder) return of(null);
      if the observable is OK its marked as pristine otherwise it is marked as update failed.
     */

    this.ordersService.editOrder(updatedOrder).subscribe({
      next: (response) => {
        console.log('Success!', response);
        this.orderForm.markAsPristine(); // Mark clean after success
        this.orderForm.markAsUntouched(); // Mark as untouched after success
        this.isSubmitting.set(false);   // Stop loading
      },
      error: (err) => {
        console.error('Update failed', err);
        this.isSubmitting.set(false);   // Stop loading so user can try again
        // We do not mark the form as dirty because we want to prompt the user that there are unsaved changes

      }
    });

    }

  }
