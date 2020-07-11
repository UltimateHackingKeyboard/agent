import { Component, EventEmitter, Output } from '@angular/core';
import { KeyAction } from 'uhk-common';

import { RemapInfo } from '../../../models/remap-info';

@Component({
    template: ''
})
export abstract class Tab {
    @Output() validAction = new EventEmitter<boolean>();

    abstract keyActionValid(): boolean;
    abstract fromKeyAction(keyAction: KeyAction): boolean;
    abstract toKeyAction(): KeyAction;
    remapInfoChanged(remapInfo: RemapInfo): void {}
}
