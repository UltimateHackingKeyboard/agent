import { CommandLineArgs } from './command-line-args';
import { DeviceConnectionState } from './device-connection-state';

export interface AppStartInfo {
    commandLineArgs: CommandLineArgs;
    deviceConnectionState: DeviceConnectionState;
    platform: string;
    osVersion: string;
    udevFileContent: string;
}
