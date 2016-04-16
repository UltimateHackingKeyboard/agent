import {KeyboardKey} from './keyboard-key.model';

export class Module {
    private coverages: any[];
    private keyboardKeys: KeyboardKey[];
    private attributes: any;

    constructor(obj: { rect: any[], path: any[], $: Object }) {
        this.keyboardKeys = obj.rect.map(rect => rect.$);
        this.coverages = obj.path;
        this.attributes = obj.$;
    }
}
