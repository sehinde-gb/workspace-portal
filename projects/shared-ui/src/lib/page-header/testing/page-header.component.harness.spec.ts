import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { PageHeaderComponent } from '../page-header.component';
import { PageHeaderHarness } from './page-header.harness';


describe('PageHeaderComponent (harness)', () => {
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
  });

  it('reads the title through the harness', async () => {
    fixture.componentInstance.title = 'Dashboard';
    fixture.componentInstance.subtitle = 'Welcome to the dashboard';
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(PageHeaderHarness);

    expect(await harness.getTitle()).toBe('Dashboard');
  });

  it('reads the subtitle through the harness', async () => {
    fixture.componentInstance.title = 'Dashboard';
    fixture.componentInstance.subtitle = 'Welcome to the dashboard';
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(PageHeaderHarness);

    expect(await harness.getSubTitle()).toBe('Welcome to the dashboard');
  });
});
