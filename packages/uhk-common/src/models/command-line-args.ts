export interface CommandLineArgs {
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
     * USB product id
     */
    pid?: number;
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
     * simulate privilege escalation error
     */
    spe?: boolean;
    /**
     * USB interface id
     */
    'usb-interface'?: number;
    /**
     * Use USB non-blocking communication
     */
    'usb-non-blocking'?: boolean;
    /**
     * USB vendor id
     */
    vid?: number;
}
