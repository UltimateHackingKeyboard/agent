import { CommandLineArgs } from './command-line-args.js';
import { FirmwareJson } from './firmware-json.js';

export interface AppStartInfo {
    commandLineArgs: CommandLineArgs;
    platform: string;
    osVersion: string;
    udevFileContent: string;
    bundledFirmwareJson: FirmwareJson;
}
