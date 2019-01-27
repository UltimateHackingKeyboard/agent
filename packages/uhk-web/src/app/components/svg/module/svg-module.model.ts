import { SvgKeyboardKey } from '../keys';

export class SvgModule {
    coverages: any[];
    keyboardKeys: SvgKeyboardKey[];
    attributes: any;

    constructor(obj: { rect: any[]; path: any[]; $: Object }) {
        let index: number;
        const keys = obj.rect.map(rect => rect.$);
        this.keyboardKeys = [];
        for (let i = 0; i < keys.length; ++i) {
            index = keys[i].id.slice(4) - 1; // remove 'key-' then switch to index from 0
            keys[i].height = +keys[i].height;
            keys[i].width = +keys[i].width;
            keys[i].fill = keys[i].style.slice(5); // remove 'fill:'
            this.keyboardKeys[index] = keys[i];
        }
        this.coverages = obj.path;
        this.attributes = obj.$;
    }
}
