import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;

  });

  it('renders message', () => {
    component.message = 'No orders available yet.';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No orders available yet.');

  });

  /* Edge cases */
  it('renders safely when message is empty', () => {
    component.message = '';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toBeTruthy();
  });
});
