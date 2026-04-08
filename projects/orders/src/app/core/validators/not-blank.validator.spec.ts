import { FormControl } from "@angular/forms";
import { notBlankValidator } from './not-blank.validator';

/*
  Pattern
  1. Arrange
  Create a form control value

  2. Act
  Run the validator function on that control

  3. Assert
  Check whether the result is null for valid
  An error object for invalid


  Arrange in the form of
  Valid cases
  Tests that should pass

  Invalid cases
  Tests that should fail

  Edge cases
  empty string
  whitespace
  non string values
  null if relevant

*/

describe('notBlankValidator', () => {

  /*
    Success cases
  */
  it('returns null for a normal non-empty string', () => {
    const control = new FormControl('Acme Ltd');

    const result = notBlankValidator()(control);

    expect(result).toBeNull();
  });

  /*

    Failure cases
  */

  it('returns blank error for a string containing only spaces', () => {
    const control = new FormControl('   ');

    const result = notBlankValidator()(control);

    expect(result).toEqual({blank: true});
  });

  /*
    Edge cases
  */

  it('returns blank error for an empty string', () => {
    const control = new FormControl('');

    const result = notBlankValidator()(control);

    expect(result).toEqual({blank: true});

  });



  it('returns null for a non-string value', () => {

    const control = new FormControl(123);

    const result = notBlankValidator()(control);

    expect(result).toBeNull();

  });


  it('returns null for a null value', () => {

    const control = new FormControl(null);

     const result = notBlankValidator()(control);

    expect(result).toBeNull();

  });

});


/* Reusable Template

describe('myValidator', () => {
  it('returns null for valid input', () => {
    const control = new FormControl(validValue);

    const result = myValidator()(control);

    expect(result).toBeNull();
  });

  it('returns expected error for invalid input', () => {
    const control = new FormControl(invalidValue);

    const result = myValidator()(control);

    expect(result).toEqual({ myError: true });
  });
});
*/
