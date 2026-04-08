import { inject } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { map } from "rxjs";
import { Observable } from "rxjs";
import { OrderEventsService } from "shared-events";

private customerService = inject(OrderEventsService);

export function uniqueCustomerNameValidator(
  service: OrderEventsService): AsyncValidatorFn {

    return (control: AbstractControl): Observable<ValidationErrors | null > => {
    return service.isCustomerNameTaken(control.value).pipe(
      map(isTaken => {
        if (isTaken) {
        return { notUnique: true};
        }
        return null;
      })
    );
  };


}
