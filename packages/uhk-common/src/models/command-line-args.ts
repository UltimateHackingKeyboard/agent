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
     * simulate privilege escalation error
     */
    spe?: boolean;
    /**
     * The driver which is used for firmware upgrade
     */
    'usb-driver'?: 'blhost' | 'kboot';
}
