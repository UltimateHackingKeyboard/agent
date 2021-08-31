export interface CommandLineArgs {
    /**
     * Allow Developer Tools menu
     */
    devtools?: boolean;
    /**
     * logging categories
     */
    log?: string;
    /**
     * modules menu visible or not
     */
    modules?: boolean;
    /**
     * show help.
     */
    help?: boolean;
    /**
     * Agent not force the udev rule update
     */
    'preserve-udev-rules'?: boolean;
    /**
     * Reenumerate as the bootloader or BusPal, wait for the specified timeout and exit.
     * This may make Windows install the USB drivers needed for firmware update.
     */
    'reenumerate-and-exit'?: string;
    /**
     * simulate privilege escalation error
     */
    spe?: boolean;
    /**
     * USB HID Driver option. It has affect only on Linux OS {hidraw|libusb}
     */
    'usb-driver'?: 'hidraw' | 'libusb';
}
