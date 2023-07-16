import { KeyAction } from '../config-serializer/index.js';

export function copyRgbColor(from: KeyAction, to: KeyAction): void {
    if (!from || !to) {
        return;
    }

    to.b = from.b;
    to.g = from.g;
    to.r = from.r;
}
