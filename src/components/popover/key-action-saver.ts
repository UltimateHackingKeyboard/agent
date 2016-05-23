import {KeyAction} from '../../../config-serializer/config-items/KeyAction';

export interface KeyActionSaver {
    keyActionValid(): boolean;
    toKeyAction(): KeyAction;
}
