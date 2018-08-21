import { browser, by, element } from 'protractor';

export class WebPage {
  navigateTo() {
    return browser.get('/');
  }

  getDeviceName() {
    return element(by.css('body > main-app > side-menu > ul > li:nth-child(1) > div > auto-grow-input > input'))
        .getAttribute('value');
  }
}
