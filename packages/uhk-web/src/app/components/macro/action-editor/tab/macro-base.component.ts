import { Output, EventEmitter } from '@angular/core';

export interface MacroValidator {
    isMacroValid: () => boolean;
}

export abstract class MacroBaseComponent implements MacroValidator {

    @Output() valid = new EventEmitter<boolean>();
    abstract isMacroValid: () => boolean;

    validate = () => this.valid.emit(this.isMacroValid());

}
