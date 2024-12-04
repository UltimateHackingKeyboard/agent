export interface Peripheral {
    close(): Promise<void>;

    open(): Promise<void>;

    /**
     * @param timeout - timeout in millisecond
     */
    read(timeout: number): Promise<Buffer>;

    write(message: Array<number>): Promise<void>;
}
