import {SvgKeyboardKey} from '../keys/svg-keyboard-key.model';

export class SvgModule {
    private coverages: any[];
    private keyboardKeys: SvgKeyboardKey[];
    private attributes: any;

    constructor(obj: { rect: any[], path: any[], $: Object }) {
        this.keyboardKeys = obj.rect.map(rect => rect.$).map(rect => {
            rect.height = +rect.height;
            rect.width = +rect.width;
            return rect;
        });
        this.coverages = obj.path;
        this.attributes = obj.$;
    }
}
