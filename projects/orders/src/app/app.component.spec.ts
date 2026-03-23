import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { OrdersFacade } from './orders.facade';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';
import { of } from 'rxjs';



const mockRoutes: Routes = [];

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let facade: jasmine.SpyObj<OrdersFacade>;


  beforeEach(async () => {
    facade = jasmine.createSpyObj('OrdersFacade', ['createOrder'], {
      orders$: of([
        { id: 1, customerName: 'Test User', total: 100, status: 'pending'}
      ])
    })

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(mockRoutes),
        { provide: OrdersFacade, useValue: facade }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

  });



  /*
    Render / UI State
  */
  it('renders orders title', () => {

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Orders Remote');
  });

 it('renders orders from facade', () => {

  fixture.detectChanges();

  expect(fixture.nativeElement.textContent).toContain('Test User');


 });

 /*
 Success
  */
 it('calls facade when button is clicked', () => {

  fixture.detectChanges();

  const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');

  btn.click();

  expect(facade.createOrder).toHaveBeenCalled();
 });
});
