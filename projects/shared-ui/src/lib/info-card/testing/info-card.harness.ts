import { ComponentHarness } from "@angular/cdk/testing";

export class InfoCardHarness extends ComponentHarness {
  static hostSelector = 'lib-info-card';

  private getLabelElement = this.locatorFor('strong');
  private getValueElement = this.locatorForOptional('p');

  async getLabelText(): Promise<string> {
    return (await this.getLabelElement()).text();
  }


  async getValue(): Promise<string | null> {
    const value = await this.getValueElement();
    return value ? value.text() : null;
  }
}
