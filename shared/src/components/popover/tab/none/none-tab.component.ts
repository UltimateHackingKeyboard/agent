import { Component, OnInit } from '@angular/core';

import { Tab } from '../tab';

@Component({
    selector: 'none-tab',
    templateUrl: './none-tab.component.html',
    styleUrls: ['./none-tab.component.scss']
})
export class NoneTabComponent extends Tab implements OnInit {

    ngOnInit() {
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
