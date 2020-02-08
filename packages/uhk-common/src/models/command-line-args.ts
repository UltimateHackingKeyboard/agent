export interface CommandLineArgs {
    /**
     * addons menu visible or not
     */
    addons?: boolean;
    /**
     * show help.
     */
    help?: boolean;
    /**
     * Agent not force the udev rule update
     */
    'preserve-udev-rules'?: boolean;
    /**
     * simulate privilege escalation error
     */
    spe?: boolean;
    /**
     * The driver which is used for firmware upgrade
     */
    usbDriver?: 'blhost' | 'kboot';
}
