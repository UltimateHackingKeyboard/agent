import { CommandLineArgs } from './command-line-args';
import { VersionInformation } from './version-information';

export interface AppStartInfo {
    commandLineArgs: CommandLineArgs;
    deviceConnected: boolean;
    hasPermission: boolean;
    /**
     * This property contains the version information of the deployed agent components
     */
    agentVersionInfo: VersionInformation;
}
