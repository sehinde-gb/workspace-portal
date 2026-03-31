import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let router: jasmine.SpyObj<Router>;


  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

  });

  /*
    Pattern
    1. Mock the dependency or environment
    2. Run the guard
    3. Assert the decision/ output

  */

  it('allows access when user is logged in', () => {
    spyOn(localStorage, 'getItem').and.returnValue('token');

    // Auth guard expects two arguments (route and state) and I have typed them as any and used the empty object sign
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    expect(result).toBeTrue();
  });

  it('redirects to login when user is not logged in', () => {
    // grabs a null value token
    spyOn(localStorage, 'getItem').and.returnValue(null);

    // a dummy object pretending to be a URL within a redirect (Urltree)
    const mockTree = {} as any;

    // redirect and return this empty URL
    router.createUrlTree.and.returnValue(mockTree);

    // Set up the authGuard
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    // expect the redirect to have been called with login page this executes the guard
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    // expect the result to be the mockTree
    expect(result).toBe(mockTree);


  });


});
