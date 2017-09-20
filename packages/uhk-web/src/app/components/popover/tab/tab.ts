import { EventEmitter, Output } from '@angular/core';
import { KeyAction } from 'uhk-common';

export abstract class Tab {
    @Output() validAction = new EventEmitter<boolean>();

    abstract keyActionValid(): boolean;
    abstract fromKeyAction(keyAction: KeyAction): boolean;
    abstract toKeyAction(): KeyAction;
}
