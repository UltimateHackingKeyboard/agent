import { CommandLineArgs } from './command-line-args';

export interface AppStartInfo {
    commandLineArgs: CommandLineArgs;
    platform: string;
    osVersion: string;
    udevFileContent: string;
}
