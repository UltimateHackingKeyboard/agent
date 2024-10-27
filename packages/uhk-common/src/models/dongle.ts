export interface Dongle {
    bleAddress?: string;

    isPairedWithKeyboard?: boolean;
    /**
     * True if more than 1 UHK dongle connected.
     */
    multiDevice: boolean;

    serialNumber: string;
}
