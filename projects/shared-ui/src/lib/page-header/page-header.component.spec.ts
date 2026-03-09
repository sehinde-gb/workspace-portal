import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;

  });

    /*
      Render / UI State
    */
  it('renders title', () => {
    component.title = 'Dashboard';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Dashboard');
  });

  it('renders title', () => {
    component.title = 'Dashboard';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Welcome to the dashboard');
  });
  /*
    Edge cases
  */
  it('renders safely when subtitle is empty', () => {
    component.title = 'Dashboard';
    component.subtitle = '';

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Dashboard');
  });
});
