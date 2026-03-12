import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { InfoCardComponent } from "../info-card.component";
import { InfoCardHarness } from "./info-card.harness";

describe('InfoCardComponent (harness)', () => {
  let fixture: ComponentFixture<InfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoCardComponent);
  });

  it('reads the label through the harness', async () => {
    fixture.componentInstance.value = 'Hello';
    fixture.componentInstance.label = 'Order from us';
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(InfoCardHarness);

    expect(await harness.getLabelText()).toBe('Order from us');
  });

  it('reads the value through the harness', async () => {
    fixture.componentInstance.value = 'Hello';
    fixture.componentInstance.label = 'Order from us';
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(InfoCardHarness);

    expect(await harness.getValue()).toBe('Hello');




  });
})
