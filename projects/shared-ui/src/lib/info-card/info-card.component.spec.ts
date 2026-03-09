import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCardComponent } from './info-card.component';

describe('InfoCardComponent', () => {
  let component: InfoCardComponent;
  let fixture: ComponentFixture<InfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoCardComponent);
    component = fixture.componentInstance;

  });

  /* Render UI / State */
  it('renders label', () => {
    component.label = 'Status';
    component.value = 'Online';

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Status');
  });

  it('renders value', () => {
    component.label = 'Status';
    component.value = 'Online';

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Online');
  });

  /* Edge Cases */
  it('renders safely when value is empty', () => {
    component.label = 'Status';
    component.value = '';

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Status');
  });
});
