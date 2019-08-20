import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    Input,
    OnChanges,
    Renderer2,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Macro } from 'uhk-common';

import { DuplicateMacroAction, EditMacroNameAction, RemoveMacroAction } from '../../../store/actions/macro';
import { AppState } from '../../../store';
import * as util from '../../../util';

@Component({
    selector: 'macro-header',
    templateUrl: './macro-header.component.html',
    styleUrls: ['./macro-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacroHeaderComponent implements AfterViewInit, OnChanges {
    @Input() macro: Macro;
    @Input() isNew: boolean;
    @ViewChild('macroName', { static: true }) macroName: ElementRef;

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

    @HostListener('window:resize')
    windowResize(): void {
        this.calculateHeaderTextWidth(this.macro.name);
    }

    removeMacro() {
        this.store.dispatch(new RemoveMacroAction(this.macro.id));
    }

    duplicateMacro() {
        this.store.dispatch(new DuplicateMacroAction(this.macro));
    }

    editMacroName(name: string) {
        if (!util.isValidName(name)) {
            this.setName();
            return;
        }

        this.store.dispatch(new EditMacroNameAction({ id: this.macro.id, name }));
    }

    calculateHeaderTextWidth(text): void {
        const htmlInput = this.macroName.nativeElement as HTMLInputElement;
        const maxWidth = htmlInput.parentElement.offsetWidth * 0.8;
        const textWidth = util.getContentWidth(window.getComputedStyle(htmlInput), text);
        this.renderer.setStyle(htmlInput, 'width', Math.min(maxWidth, textWidth) + 'px');
    }

    private setFocusOnName() {
        this.macroName.nativeElement.select();
    }

    private setName(): void {
        this.renderer.setProperty(this.macroName.nativeElement, 'value', this.macro.name);
        this.calculateHeaderTextWidth(this.macro.name);
    }

}
