import { Input } from '@angular/core';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { copyRgbColor, KeyAction, NoneAction } from 'uhk-common';

import { Tab } from '../tab';

@Component({
    selector: 'none-tab',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './none-tab.component.html',
    styleUrls: ['./none-tab.component.scss']
})
export class NoneTabComponent extends Tab implements OnInit {
    @Input() defaultKeyAction: KeyAction;

    ngOnInit() {
        this.validAction.emit(true);
    }

    keyActionValid(): boolean {
        return true;
    }

    fromKeyAction(): boolean {
        return false;
    }

    toKeyAction(): NoneAction {
        const keyAction = new NoneAction();
        copyRgbColor(this.defaultKeyAction, keyAction);

        return keyAction;
    }

}
