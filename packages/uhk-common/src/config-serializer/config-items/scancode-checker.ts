import { SCANCODES } from './';

let scancodeMap: Map<number, any>;

export function isScancodeExists(scancode: number): boolean {
    if (!scancodeMap) {
        fillScancodeMap();
    }

    return scancodeMap.has(scancode);
}

function fillScancodeMap(): void {
    scancodeMap = new Map<number, any>();

    for (const scanGroup of SCANCODES) {
        for (const child of scanGroup.children) {
            if (child.additional && child.additional.scancode) {
                scancodeMap.set(child.additional.scancode, child);
            } else {
                scancodeMap.set(Number.parseInt(child.id), child);
            }
        }
    }
}
