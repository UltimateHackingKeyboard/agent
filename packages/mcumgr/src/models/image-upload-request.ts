export interface ImageUploadRequest {
    data: Uint8Array;
    off: number;
    len?: number;
    sha?: Uint8Array;
}
