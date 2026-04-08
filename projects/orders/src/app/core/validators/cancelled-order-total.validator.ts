import { AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function cancelledOrderTotalValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const status = control.get('status')?.value;
    const total = control.get('total')?.value;

    if (status === 'cancelled' && total !== 0) {
      return { cancelledOrderTotal: true};
    }
      return null;
  };
}
