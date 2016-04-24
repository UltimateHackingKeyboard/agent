import {SvgKeyboardKey} from './svg-keyboard-key.model';

export class SvgModule {
    private coverages: any[];
    private keyboardKeys: SvgKeyboardKey[];
    private attributes: any;

    constructor(obj: { rect: any[], path: any[], $: Object }) {
        this.keyboardKeys = obj.rect.map(rect => rect.$);
        this.coverages = obj.path;
        this.attributes = obj.$;
    }
}
