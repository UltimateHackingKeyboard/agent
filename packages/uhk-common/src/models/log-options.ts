export interface LogOptions {
    /**
     * Log every USB operations USB[T], USB[W], USB[R]
     */
    usb?: boolean;
    /**
     * Log only USB[T] log entries
     */
    usbOps?: boolean;
    config?: boolean;
    misc?: boolean;
}
