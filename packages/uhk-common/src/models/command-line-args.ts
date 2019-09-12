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
     * If it is true use kboot package instead of blhost for firmware upgrade
     */
    useKboot?: boolean;
}
