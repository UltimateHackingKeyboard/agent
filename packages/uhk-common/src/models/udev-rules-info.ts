/**
 * What is the state of the udev rules.
 * Only on Linux need extra udev rules.
 */
export enum UdevRulesInfo {
    Unkonwn,
    Ok,
    /**
     * Udev rules not exists need to setup on Linux
     */
    NeedToSetup,
    /**
     * Udev rules exist but different than expected on Linux
     */
    Different
}
