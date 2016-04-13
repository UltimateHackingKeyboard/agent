import {KeyboardKey} from './keyboard-key.model';

export class Module {
    private case: any;
    private keyboardKeys: KeyboardKey[];
    private attributes: any;

    constructor(obj: { rect: any[], path: any[], $: Object }, fill?: string) {
        this.keyboardKeys = obj.rect.map(rect => rect.$);
        this.keyboardKeys.forEach(keyboardKey => keyboardKey.fill = fill ? fill : 'black');
        this.case = obj.path[0].$;
        this.attributes = obj.$;
    }
}
