import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { KeyAction } from 'uhk-common';

import { Tab } from '../tab';

@Component({
    selector: 'special-tab',
    templateUrl: './special-tab.component.html',
    styleUrls: ['./special-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecialTabComponent extends Tab implements OnChanges {
    @Input() defaultKeyAction: KeyAction;

    ngOnChanges(changes: SimpleChanges): void {

    }

    keyActionValid(): boolean {
        return true;
    }

    fromKeyAction(keyAction: KeyAction): boolean {
        return true;
    }

    toKeyAction(): KeyAction {
        return this.defaultKeyAction;
    }
}
