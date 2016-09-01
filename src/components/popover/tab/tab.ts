import {KeyAction} from '../../../config-serializer/config-items/KeyAction';

export interface Tab {
    keyActionValid(): boolean;
    fromKeyAction(keyAction: KeyAction): boolean;
    toKeyAction(): KeyAction;
}
