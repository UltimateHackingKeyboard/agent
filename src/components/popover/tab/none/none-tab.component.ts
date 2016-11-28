import { Component } from '@angular/core';

import { Tab } from '../tab';

@Component({
    selector: 'none-tab',
    template: require('./none-tab.component.html'),
    styles: [require('./none-tab.component.scss')]
})
export class NoneTabComponent implements Tab {
    keyActionValid(): boolean {
        return true;
    }

    fromKeyAction(): boolean {
        return false;
    }

    toKeyAction(): undefined {
        return undefined;
    }

}
