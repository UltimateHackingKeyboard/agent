import { CommandLineArgs } from './command-line-args.js';

export interface AppStartInfo {
    commandLineArgs: CommandLineArgs;
    platform: string;
    osVersion: string;
    udevFileContent: string;
}
