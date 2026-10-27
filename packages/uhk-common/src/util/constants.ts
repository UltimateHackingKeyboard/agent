export const AGENT_GITHUB_URL = 'https://github.com/UltimateHackingKeyboard/agent';
export const AGENT_CONTRIBUTORS_GITHUB_PAGE_URL = 'https://github.com/UltimateHackingKeyboard/agent/graphs/contributors';
export const AGENT_CONTRIBUTORS_GITHUB_API_URL = 'https://api.github.com/repos/UltimateHackingKeyboard/agent/contributors';
export const MAX_ALLOWED_MACROS = 255;
export const MAX_ALLOWED_MACROS_TOOLTIP = `No more than ${MAX_ALLOWED_MACROS} macros are supported.`;

export const DEFAULT_DEVICE_NAME = 'My UHK';

export const UHK_EEPROM_SIZE = 32768;
export const ERR_UPDATER_INVALID_SIGNATURE = 'ERR_UPDATER_INVALID_SIGNATURE';

/**
 * Time in milliseconds that the UHK bootloader waits for the mcumgr firmware update to start.
 * Agent sends this value to the device when it reenumerates it into bootloader mode, and also
 * uses it as the time budget to open the bootloader serial port.
 */
export const DEFAULT_BOOTLOADER_TIMEOUT_MS = 5000;
/**
 * Lower bound of the configurable bootloader timeout. A shorter timeout is not enough for the
 * bootloader to be detected on the slower hosts.
 */
export const MIN_BOOTLOADER_TIMEOUT_MS = 1000;
/**
 * Upper bound of the configurable bootloader timeout.
 */
export const MAX_BOOTLOADER_TIMEOUT_MS = 60000;
