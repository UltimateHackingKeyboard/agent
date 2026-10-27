import {
    DEFAULT_BOOTLOADER_TIMEOUT_MS,
    MAX_BOOTLOADER_TIMEOUT_MS,
    MIN_BOOTLOADER_TIMEOUT_MS,
} from './constants.js';

/**
 * Make the incoming bootloader timeout safe to use.
 * Returns the default timeout when the incoming value is not a valid number and clamps the
 * valid values into the supported range.
 *
 * @param value - timeout in millisecond
 */
export function clampBootloaderTimeout(value?: number): number {
    if (!Number.isFinite(value)) {
        return DEFAULT_BOOTLOADER_TIMEOUT_MS;
    }

    return Math.min(Math.max(Math.round(value), MIN_BOOTLOADER_TIMEOUT_MS), MAX_BOOTLOADER_TIMEOUT_MS);
}
