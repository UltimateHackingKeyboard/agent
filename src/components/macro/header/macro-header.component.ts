import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, Renderer,
    ViewChild
} from '@angular/core';

import { Store } from '@ngrx/store';

import { Macro } from '../../../config-serializer/config-items/Macro';

import { MacroActions } from '../../../store/actions';
import { AppState } from '../../../store/index';

@Component({
    selector: 'macro-header',
    template: require('./macro-header.component.html'),
    styles: [require('./macro-header.component.scss')],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacroHeaderComponent implements AfterViewInit {
    @Input() macro: Macro;
    @Input() isNew: boolean;
    @ViewChild('macroName') macroName: ElementRef;

    constructor(private store: Store<AppState>, private renderer: Renderer) { }

    ngAfterViewInit() {
        if (this.isNew) {
            this.renderer.invokeElementMethod(this.macroName.nativeElement, 'select', []);
        }
    }

    removeMacro() {
        this.store.dispatch(MacroActions.removeMacro(this.macro.id));
    }

    duplicateMacro() {
        this.store.dispatch(MacroActions.duplicateMacro(this.macro));
    }

    editMacroName(name: string) {
        if (name.length === 0) {
            this.renderer.setElementProperty(this.macroName.nativeElement, 'value', this.macro.name);
            return;
        }

        this.store.dispatch(MacroActions.editMacroName(this.macro.id, name));
    }
}
