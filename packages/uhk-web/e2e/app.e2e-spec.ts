import { WebPage } from './app.po';

describe('web App', () => {
    let page: WebPage;

    beforeEach(() => {
        page = new WebPage();
    });

    it('should display default device name', () => {
        page.navigateTo();
        expect(page.getDeviceName()).toEqual('My UHK');
    });
});
