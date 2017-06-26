import { Component, EventEmitter, Input, Output, QueryList, ViewChildren, forwardRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { Macro } from '../../../config-serializer/config-items/macro';
import { MacroAction } from '../../../config-serializer/config-items/macro-action';
import { MacroItemComponent } from './../index';

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
    @ViewChildren(forwardRef(() => MacroItemComponent)) macroItems: QueryList<MacroItemComponent>;

    @Output() add = new EventEmitter();
    @Output() edit = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() reorder = new EventEmitter();

    private newMacro: Macro = undefined;
    private activeEdit: number = undefined;
    private dragIndex: number;
    private showNew: boolean = false;

    constructor(dragulaService: DragulaService) {
        /* tslint:disable:no-unused-variable: Used by Dragula. */
        dragulaService.setOptions('macroActions', {
            moves: function (el: any, container: any, handle: any) {
                return handle.className.includes('action--movable');
            }
        });

        dragulaService.drag.subscribe((value: any) => {
            this.dragIndex = +value[1].getAttribute('data-index');
        });

        dragulaService.drop.subscribe((value: any) => {
            if (value[4]) {
                this.reorder.emit({
                    macroId: this.macro.id,
                    oldIndex: this.dragIndex,
                    newIndex: +value[4].getAttribute('data-index')
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

    private hideActiveEditor() {
        if (this.activeEdit !== undefined) {
            this.macroItems.toArray()[this.activeEdit].cancelEdit();
        }
    }
}
