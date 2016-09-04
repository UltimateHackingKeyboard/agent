import {KeyAction} from '../../../config-serializer/config-items/key-action';

export interface Tab {
    keyActionValid(): boolean;
    fromKeyAction(keyAction: KeyAction): boolean;
    toKeyAction(): KeyAction;
}
