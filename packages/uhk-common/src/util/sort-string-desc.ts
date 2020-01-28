export function sortStringDesc(a: string, b: string): number {
    return a.localeCompare(b) * -1;
}
