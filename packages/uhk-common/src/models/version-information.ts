export interface VersionInformation {
    agentRepo: string;
    agentTag: string;
    agentBranch?: string;
    version: string;
    firmwareVersion: string;
    deviceProtocolVersion: string;
    userConfigVersion: string;
    hardwareConfigVersion: string;
}
