import { WebPage } from './app.po';

describe('web App', () => {
  let page: WebPage;

  beforeEach(() => {
    page = new WebPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
