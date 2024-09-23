export interface DeviceIdentifier {
    /**
     * USB product id
     */
    pid?: number;

    /**
     * USB interface id
     */
    'usb-interface'?: number;

    /**
     * Serial number
     */
    'serial-number'?: string;

    /**
     * USB vendor id
     */
    vid?: number;
}

export interface CommandLineArgs extends DeviceIdentifier {
    /**
     * Allow Developer Tools menu
     */
    devtools?: boolean;

    /**
     * Don't show the update agent screen
     * and allow to upgrade firmware that uses newer user config version that Agent support
     */
    'disable-agent-update-protection'?: boolean;
    /**
     * Agent simulate the error that named in the argument
     */
    'error-simulation'?: string;

    /**
     * logging categories
     */
    log?: string;
    /**
     * show help.
     */
    help?: boolean;
    /**
     * Don't use report id for USB communication
     */
    'no-report-id'?: boolean;
    /**
     * Agent not force the udev rule update
     */
    'preserve-udev-rules'?: boolean;
    /**
     * Agent not force the udev rule update
     */
    'print-usb-devices'?: boolean;
    /**
     * Reenumerate as the bootloader or BusPal, wait for the specified timeout and exit.
     * This may make Windows install the USB drivers needed for firmware update.
     */
    'reenumerate-and-exit'?: string;
    /**
     * Report Id that used for USB communication
     */
    'report-id'?: number;
    /**
     * simulate privilege escalation error
     */
    spe?: boolean;
    /**
     * Use USB non-blocking communication
     */
    'usb-non-blocking'?: boolean;
}
