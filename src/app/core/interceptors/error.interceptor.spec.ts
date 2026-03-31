import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './error.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let notificationService: jasmine.SpyObj<NotificationService>;


  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError']);

      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptors([errorInterceptor])),
          provideHttpClientTesting(),
          { provide: Router, useValue: routerSpy },
          { provide: NotificationService, useValue: notificationSpy }
        ]
      });
      http = TestBed.inject(HttpClient);
      httpMock = TestBed.inject(HttpTestingController);
      router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
      notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    });

    afterEach(() => {
    httpMock.verify();
  });

  it('passes through non-handled HTTP errors', () => {
    // Set the error type
    let actualError: any;

    spyOn(console, 'error');

    // (Trigger) if error is successful nothing if fails then error is captured
    http.get('/api/orders').subscribe({
      next: () => fail('expected error'),
      error: err => {
        actualError = err;
      }
    });

    // (Run) intercepts the outgoing request
    const req = httpMock.expectOne('/api/orders');

    // Send the req to the back end
    req.flush('Not found', { status: 404, statusText: 'Not Found' });

    // (Assert) that the error received is 404
    expect(actualError.status).toBe(404);
    expect(console.error).toHaveBeenCalledWith('HTTP error:', 404);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(notificationService.showError).not.toHaveBeenCalled();
  });



  it('redirects to login and passes through 401 errors', () => {
    // Set the error type
    let actualError: any;

    spyOn(console, 'error');


    // (Trigger) if error is successful nothing if fails then error is captured
    http.get('/api/orders').subscribe({
      next: () => fail('expected a 401 error, but got a successful response'),
      error: err => {
        actualError = err;
      }
    });

    // (Run) intercepts the outgoing request
    const req = httpMock.expectOne('/api/orders');
    // Send the req to the back end
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    // (Assert) that the error received is 401 and we have redirected to the login page
    expect(console.error).toHaveBeenCalledWith('HTTP error:', 401);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(notificationService.showError).not.toHaveBeenCalled();
    expect(actualError.status).toBe(401);
});

  it('shows notification and passes through 500 errors', () => {
    // Set the error type
    let actualError: any;

    spyOn(console, 'error');


    // (Trigger) if error is successful nothing if fails then error is captured
    http.get('/api/orders').subscribe({
      next: () => fail('expected a 500 error, but got a successful response'),
      error: err => {
        actualError = err;

      }
    });

    // (Run) intercepts the outgoing request
    const req = httpMock.expectOne('/api/orders');

     // Send the req to the back end
    req.flush('Server failure', {
      status: 500,
      statusText: 'Server Error'
    });

    // (Assert) that the error received is 500 and we have NOT redirected to the login page
    expect(console.error).toHaveBeenCalledWith('HTTP error:', 500);
    expect(notificationService.showError).toHaveBeenCalledWith(
      'Something went wrong. Please try again'
    );

    expect(router.navigate).not.toHaveBeenCalled();
    expect(actualError.status).toBe(500);
  });
});
