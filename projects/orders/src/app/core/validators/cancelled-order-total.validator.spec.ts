import { FormControl, FormGroup } from "@angular/forms";
import { cancelledOrderTotalValidator } from "./cancelled-order-total.validator";


describe('cancelledOrderTotalValidator', () => {
  /*
    Success cases
  */

  it('returns returns cancelledOrderTotal error when status is cancelled and total is greater than 0', () => {

    // Arrange
    const form = new FormGroup(
      {
        status: new FormControl('cancelled'),
        total: new FormControl(3)
      },
      { validators: [cancelledOrderTotalValidator()] }

    );


    // Assert
    expect(form.errors).toEqual({ cancelledOrderTotal: true});
    
  });


  /*
    Failure cases
  */

  it('returns null when status is cancelled and total is 0', () => {

    // Arrange
    const form = new FormGroup(
      {
        status: new FormControl('cancelled'),
        total: new FormControl(0)
      },
      { validators: [cancelledOrderTotalValidator()] }

    );



     // Assert
    expect(form.errors).toBeNull();

  });


  /*
    Edge cases
  */

  it('returns null when status is null and total is null', () => {

     // Arrange
    const form = new FormGroup(
      {
        status: new FormControl(null),
        total: new FormControl(null)
      },
      { validators: [cancelledOrderTotalValidator()] }

    );


    // Assert
    expect(form.errors).toBeNull();
  });



  it('returns null when status is pending and total is 0', () => {
 // Arrange
    const form = new FormGroup(
      {
        status: new FormControl('pending'),
        total: new FormControl(null)
      },
      { validators: [cancelledOrderTotalValidator()] }

    );


     // Assert
    expect(form.errors).toBeNull();
  });
});
