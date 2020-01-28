export function getMd5HashFromFilename(filename: string): string {
    return filename.substr(16, 32);
}
