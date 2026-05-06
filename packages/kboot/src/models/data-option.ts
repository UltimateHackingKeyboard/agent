export interface DataOption {
    startAddress: number;
    data: Buffer | Uint8Array;
    timeout?: number;
}
