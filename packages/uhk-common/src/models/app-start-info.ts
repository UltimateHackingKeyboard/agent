import { CommandLineArgs } from './command-line-args.js';

export interface AppStartInfo {
    commandLineArgs: CommandLineArgs;
    platform: string;
    osVersion: string;
    udevFileContent: string;
    isRunningOnWayland: boolean;
    /**
     * True when Agent runs inside a Flatpak sandbox. Flatpak manages device
     * permissions and updates, so the Linux privilege flow differs.
     */
    isFlatpak: boolean;
}
