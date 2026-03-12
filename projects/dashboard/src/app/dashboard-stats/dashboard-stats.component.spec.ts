import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardStatsComponent } from './dashboard-stats.component';
import { DashboardStats } from 'shared-data';

describe('DashboardStatsComponent', () => {
  let component: DashboardStatsComponent;
  let fixture: ComponentFixture<DashboardStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardStatsComponent);
    component = fixture.componentInstance;

  });

  const mockStats: DashboardStats = {
    totalOrders: 23,
    pendingOrders: 45,
    completedOrders: 93
  }

  const zeroStats: DashboardStats = {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  }

/*
 Render / UI State
*/

  it('renders totalOrders', () => {
    component.stats = mockStats;

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('23');
  });

  it('renders pendingOrders', () => {
    component.stats = mockStats;

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('45');
  });

  it('renders completedOrders', () => {
    component.stats = mockStats;

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('93');
  });

  /*
    Edge cases
  */
  it('renders safely when values are zero', () => {
    component.stats = zeroStats;

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('0');
  });


});
