export interface Dongle {
    bleAddress?: string;

    bootloaderActive: boolean;

    isPairedWithKeyboard?: boolean;
    /**
     * True if more than 1 UHK dongle connected.
     */
    multiDevice: boolean;

    serialNumber: string;
}
