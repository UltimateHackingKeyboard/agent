import { Component, EventEmitter, Input, Output, QueryList, ViewChildren, forwardRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DragulaService } from 'ng2-dragula';
import { Macro, MacroAction, KeyMacroAction, KeystrokeAction, MacroKeySubAction } from 'uhk-common';

import { MapperService } from '../../../services/mapper.service';
import { MacroItemComponent } from '../item';

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
    styleUrls: ['./macro-list.component.scss'],
    viewProviders: [DragulaService]
})
export class MacroListComponent {
    @Input() macro: Macro;
    @Input() macroPlaybackSupported: boolean;
    @ViewChildren(forwardRef(() => MacroItemComponent)) macroItems: QueryList<MacroItemComponent>;

    @Output() add = new EventEmitter();
    @Output() edit = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() reorder = new EventEmitter();

    newMacro: Macro = undefined;
    showNew: boolean = false;
    private activeEdit: number = undefined;

    constructor(
        private mapper: MapperService,
        private dragulaService: DragulaService
    ) {
        /* tslint:disable:no-unused-variable: Used by Dragula. */
        dragulaService.createGroup('macroActions', {
            moves: function (el: any, container: any, handle: any) {
                return handle.className.includes('action--movable');
            }
        });

        dragulaService.drop('macroActions').subscribe(value => {
            if (value.el) {
                let newIndex = this.macroItems.length - 1;

                if (value.sibling) {
                    newIndex = (+value.sibling.getAttribute('data-index') - 1);
                }

                this.reorder.emit({
                    macroId: this.macro.id,
                    oldIndex: +value.el.getAttribute('data-index'),
                    newIndex
                });
            }
        });
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

    onKeysCapture(event: { code: number, left: boolean[], right: boolean[] }) {
        const keyMacroAction = Object.assign(new KeyMacroAction(), this.toKeyAction(event));
        keyMacroAction.action = MacroKeySubAction.tap;

        this.add.emit({
            macroId: this.macro.id,
            action: keyMacroAction
        });
    }

    private toKeyAction(event: { code: number, left: boolean[], right: boolean[] }): KeystrokeAction {
        const keystrokeAction: KeystrokeAction = new KeystrokeAction();
        keystrokeAction.scancode = event.code;
        keystrokeAction.modifierMask = 0;
        const modifiers = event.left.concat(event.right).map(x => x ? 1 : 0);
        for (let i = 0; i < modifiers.length; ++i) {
            keystrokeAction.modifierMask |= modifiers[i] << this.mapper.modifierMapper(i);
        }
        return keystrokeAction;
    }

    private hideActiveEditor() {
        if (this.activeEdit !== undefined) {
            this.macroItems.toArray()[this.activeEdit].cancelEdit();
        }
    }
}
