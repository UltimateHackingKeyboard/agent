import { UhkRendererPage } from './app.po';

describe('uhk-renderer App', () => {
  let page: UhkRendererPage;

  beforeEach(() => {
    page = new UhkRendererPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
