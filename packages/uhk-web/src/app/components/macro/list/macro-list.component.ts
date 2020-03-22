import { Component, EventEmitter, Input, Output, QueryList, ViewChildren, forwardRef, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DragulaService } from 'ng2-dragula';
import { Macro, MacroAction, KeyMacroAction, KeystrokeAction, MacroKeySubAction } from 'uhk-common';

import { MacroItemComponent } from '../item';
import { mapLeftRightModifierToKeyActionModifier } from '../../../util';
import { KeyCaptureData } from '../../../models/svg-key-events';

@Component({
    animations: [
        trigger('toggler', [
            state('inactive', style({
                height: '0px'
            })),
            state('active', style({
                height: '*'
            })),
            transition('inactive <=> active', animate('500ms ease-out'))
        ]),
        trigger('togglerNew', [
            state('void', style({
                height: '0px'
            })),
            state('active', style({
                height: '*'
            })),
            transition(':enter', animate('500ms ease-out')),
            transition(':leave', animate('500ms ease-out'))
        ])
    ],
    selector: 'macro-list',
    templateUrl: './macro-list.component.html',
    styleUrls: ['./macro-list.component.scss']
})
export class MacroListComponent implements OnDestroy {
    @Input() macro: Macro;
    @Input() macroPlaybackSupported: boolean;
    @ViewChildren(forwardRef(() => MacroItemComponent)) macroItems: QueryList<MacroItemComponent>;

    @Output() add = new EventEmitter();
    @Output() edit = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() reorder = new EventEmitter();

    newMacro: Macro = undefined;
    showNew: boolean = false;
    MACRO_ACTIONS = 'macroActions';
    private activeEdit: number = undefined;

    constructor(private dragulaService: DragulaService) {
        dragulaService.createGroup(this.MACRO_ACTIONS, {
            moves: (el, container, handle) => {
                return handle.classList.contains('action--movable');
            }
        });
    }

    ngOnDestroy(): void {
        this.dragulaService.destroy(this.MACRO_ACTIONS);
    }

    showNewAction() {
        this.hideActiveEditor();

        this.newMacro = undefined;
        this.showNew = true;
    }

    hideNewAction() {
        this.showNew = false;
    }

    addNewAction(macroAction: MacroAction) {
        this.add.emit({
            macroId: this.macro.id,
            action: macroAction
        });

        this.newMacro = undefined;
        this.showNew = false;
    }

    editAction(index: number) {
        // Hide other editors when clicking edit button of a macro action
        this.hideActiveEditor();
        this.showNew = false;
        this.activeEdit = index;
    }

    cancelAction() {
        this.activeEdit = undefined;
    }

    saveAction(macroAction: MacroAction, index: number) {
        this.edit.emit({
            macroId: this.macro.id,
            index: index,
            action: macroAction
        });

        this.hideActiveEditor();
    }

    deleteAction(macroAction: MacroAction, index: number) {
        this.delete.emit({
            macroId: this.macro.id,
            index: index,
            action: macroAction
        });

        this.hideActiveEditor();
    }

    onKeysCapture(event: KeyCaptureData) {
        const keyMacroAction = Object.assign(new KeyMacroAction(), this.toKeyAction(event));
        keyMacroAction.action = MacroKeySubAction.tap;

        this.add.emit({
            macroId: this.macro.id,
            action: keyMacroAction
        });
    }

    macroActionReordered(macroActions: MacroAction[]): void {
        this.reorder.emit({
            macroId: this.macro.id,
            macroActions
        });
    }

    private toKeyAction(event: KeyCaptureData): KeystrokeAction {
        const keystrokeAction: KeystrokeAction = new KeystrokeAction();
        keystrokeAction.scancode = event.code;
        keystrokeAction.modifierMask = 0;
        keystrokeAction.modifierMask = mapLeftRightModifierToKeyActionModifier(event.left, event.right);

        return keystrokeAction;
    }

    private hideActiveEditor() {
        if (this.activeEdit !== undefined) {
            this.macroItems.toArray()[this.activeEdit].cancelEdit();
        }
    }
}
