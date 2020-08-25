export interface CommandLineArgs {
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
     * Reenumerate as the bootloader or BusPal, wait for the specified seconds and exit.
     * May make Windows install the relevant USB drivers.
     */
    'reenumerate-and-exit'?: string;
    /**
     * simulate privilege escalation error
     */
    spe?: boolean;
    /**
     * The driver which is used for firmware upgrade
     */
    'usb-driver'?: 'blhost' | 'kboot';
}
