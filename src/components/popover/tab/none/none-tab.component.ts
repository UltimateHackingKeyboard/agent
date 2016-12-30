import { Component, EventEmitter, OnChanges, Output } from '@angular/core';

import { Tab } from '../tab';

@Component({
    selector: 'none-tab',
    template: require('./none-tab.component.html'),
    styles: [require('./none-tab.component.scss')]
})
export class NoneTabComponent implements OnChanges, Tab {
    @Output() validAction = new EventEmitter();

    ngOnChanges(event: any) {
        this.validAction.emit(true);
    }

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
