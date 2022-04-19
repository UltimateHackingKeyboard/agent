export const UHK_OFFICIAL_FIRMWARE_REPO = 'UltimateHackingKeyboard/firmware';

export function isOfficialUhkFirmware(gitRepo: string): boolean {
    return gitRepo === UHK_OFFICIAL_FIRMWARE_REPO;
}
