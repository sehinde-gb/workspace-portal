import { ComponentHarness } from '@angular/cdk/testing';
export class PageHeaderHarness extends ComponentHarness {
  static hostSelector = 'lib-page-header';

  private getTitleElement = this.locatorFor('h2');
  private getSubtitleElement = this.locatorForOptional('p');

  async getTitle(): Promise<string> {
    return (await this.getTitleElement()).text();
  }

  async getSubTitle(): Promise<string | null> {
    const subtitle = await this.getSubtitleElement();
    return subtitle ? subtitle.text() : null;
  }
}
