import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('adds Authorization header when token exists', () => {
    // Retrieve the token and assign a value
    spyOn(localStorage, 'getItem').and.returnValue('abc123');

    // Call the apiURL
    http.get('/api/orders').subscribe();

    // intercepts the outgoing request
    const req = httpMock.expectOne('/api/orders');

    // Expect that the Authorization header has been added
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');

    req.flush([]);

  });

  it('does not add Authorization header when token is missing', () => {
     // Retrieve the token and assign null
    spyOn(localStorage, 'getItem').and.returnValue(null);

    // Call the apiURL
    http.get('/api/orders').subscribe();

    // Set the apiUrl to httpMock
    const req = httpMock.expectOne('/api/orders');

    // Expect that the Authorization header has NOT been set
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeFalse();

  });
});
