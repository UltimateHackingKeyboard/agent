export function getMd5HashFromFilename(filename: string): string {
    return filename.substring(16, 48);
}
