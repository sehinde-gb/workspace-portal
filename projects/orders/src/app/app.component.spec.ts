import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { OrderEventsService } from 'shared-events';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';


const mockRoutes: Routes = [];

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let orderEvents: OrderEventsService;

  const mockOrderEventsService = {
    getState: jasmine.createSpy().and.returnValue({
      recentOrders: [{ customerName: 'New Customer'}],
      stats: {totalOrders: 25 }
    })
  };


  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(mockRoutes)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    orderEvents = TestBed.inject(OrderEventsService);
  });



  /*
    Render / UI State
  */
  it('renders orders title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Orders Remote');
  });

  /*
    Success paths
  */

  it('creates a mock order when button is clicked', () => {
    fixture.detectChanges();

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    const state = orderEvents.getState();

    expect(state.recentOrders[0].customerName).toBe('New Customer');
    expect(state.stats.totalOrders).toBe(25);

  });
});
