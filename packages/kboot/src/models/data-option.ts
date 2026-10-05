type ProgressCallback = (percent: number) => void;

export interface DataOption {
    startAddress: number;
    data: Buffer | Uint8Array;
    onProgress?: ProgressCallback;
    timeout?: number;
}
