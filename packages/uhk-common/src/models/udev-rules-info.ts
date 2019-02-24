/**
 * What is the state of the udev rules.
 * Only on Linux need extra udev rules.
 */
export enum UdevRulesInfo {
    Unknown = 'Unknown',
    Ok = 'Ok',
    /**
     * Udev rules not exists need to setup on Linux
     */
    NeedToSetup = 'NeedToSetup',
    /**
     * Udev rules exist but different than expected on Linux
     */
    Different = 'Different'
}
