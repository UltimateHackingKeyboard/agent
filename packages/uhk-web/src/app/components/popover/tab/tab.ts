import { EventEmitter, Output } from '@angular/core';

import { KeyAction } from '../../../config-serializer/config-items/key-action';

export abstract class Tab {
    @Output() validAction = new EventEmitter<boolean>();

    abstract keyActionValid(): boolean;
    abstract fromKeyAction(keyAction: KeyAction): boolean;
    abstract toKeyAction(): KeyAction;
}
