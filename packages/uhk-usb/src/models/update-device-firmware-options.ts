export interface UpdateDeviceFirmwareOptions {
    /**
     * Timeout in millisecond that the bootloader waits for the firmware update to start.
     * When it is not set then DEFAULT_BOOTLOADER_TIMEOUT_MS is used.
     */
    bootloaderTimeout?: number;
}
