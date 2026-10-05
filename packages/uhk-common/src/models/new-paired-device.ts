/**
 * A Bluetooth bond that exists on the keyboard but has no host connection in the user configuration yet.
 */
export interface NewPairedDevice {
    /**
     * The BLE address of the paired device.
     */
    address: string;
    /**
     * The host connection slot the firmware associates with this bond, 0 based index into the
     * serialized `hostConnections` array. Undefined when the device protocol is older than the
     * version that reports slots, in which case the first empty slot has to be used.
     */
    slot?: number;
}
