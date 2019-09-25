export interface CommandLineArgs {
    /**
     * addons menu visible or not
     */
    addons?: boolean;
    /**
     * simulate privilege escalation error
     */
    spe?: boolean;
    /**
     * The driver which is used for firmware upgrade
     */
    usbDriver?: 'blhost' | 'kboot';
}
