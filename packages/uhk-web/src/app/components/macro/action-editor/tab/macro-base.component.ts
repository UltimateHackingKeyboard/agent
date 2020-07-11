import { Output, EventEmitter, Component } from '@angular/core';

export interface MacroValidator {
    isMacroValid: () => boolean;
}

@Component({
    template: ''
})
export abstract class MacroBaseComponent implements MacroValidator {

    @Output() valid = new EventEmitter<boolean>();
    abstract isMacroValid: () => boolean;

    validate = () => this.valid.emit(this.isMacroValid());

}
