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
     * Use USB non-blocking communication
     */
    'usb-non-blocking'?: boolean;
}
