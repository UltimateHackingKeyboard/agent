import { UserConfiguration } from '../config-serializer/config-items/user-configuration';

export interface UndoUserConfigData {
    path: string;
    config: UserConfiguration;
}
