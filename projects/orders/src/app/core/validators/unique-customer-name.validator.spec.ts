import { FormControl } from "@angular/forms";
import { uniqueCustomerNameValidator } from './unique-customer-name.validator';

import { of, from } from "rxjs";


it('returns notUnique error when customer name is already taken', (done) => {
  const serviceSpy = jasmine.createSpyObj('CustomerService', ['isCustomerNameTaken']);
  serviceSpy.isCustomerNameTaken.and.returnValue(of(true));

  const validator = uniqueCustomerNameValidator(serviceSpy);
  const control = new FormControl('Acme Ltd');

  from(validator(control)).subscribe(result => {
    expect(result).toEqual({notUnique: true});
    done();
  })

})
