import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnChanges,
    Renderer2,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Macro } from 'uhk-common';

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

    constructor(private store: Store<AppState>, private renderer: Renderer2) { }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isNew) {
            this.setFocusOnName();
        }
        if (changes['macro']) {
            this.setName();
        }
    }

    ngAfterViewInit() {
        if (this.isNew) {
            this.setFocusOnName();
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
            this.setName();
            return;
        }

        this.store.dispatch(MacroActions.editMacroName(this.macro.id, name));
    }

    private setFocusOnName() {
        this.macroName.nativeElement.select();
    }

    private setName(): void {
        this.renderer.setProperty(this.macroName.nativeElement, 'value', this.macro.name);
    }

}
