import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, Renderer,
    ViewChild
} from '@angular/core';

import { Store } from '@ngrx/store';

import { Macro } from '../../../config-serializer/config-items/macro';

import { MacroActions } from '../../../store/actions';
import { AppState } from '../../../store/index';

@Component({
    selector: 'macro-header',
    templateUrl: './macro-header.component.html',
    styleUrls: ['./macro-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacroHeaderComponent implements AfterViewInit, OnChanges {
    @Input() macro: Macro;
    @Input() isNew: boolean;
    @ViewChild('macroName') macroName: ElementRef;

    constructor(private store: Store<AppState>, private renderer: Renderer) { }

    ngOnChanges() {
        if (this.isNew) {
            this.renderer.invokeElementMethod(this.macroName.nativeElement, 'select', []);
        }
    }

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
