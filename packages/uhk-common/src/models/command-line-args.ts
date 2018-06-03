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
     * show 'Lock layer when double tapping this key' checkbox on 'Layer' tab of the config popover
     * if it false the checkbox invisible and the value of the checkbox = true
     */
    layerDoubleTap?: boolean;
}
