import {KeyboardButton} from './keyboard-button.model';

export class Module {
    private case: any;
    private keyboardButtons: KeyboardButton[];

    constructor(obj: { rect: any[], path: any[] }, fill?: string) {
        this.keyboardButtons = obj.rect.map(obj => obj.$);
        this.keyboardButtons.forEach(keyboardButton => keyboardButton.fill = fill ? fill : 'black');
        this.case = obj.path[0].$;
    }
}