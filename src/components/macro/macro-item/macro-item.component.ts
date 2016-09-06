import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';

import {MacroAction, macroActionType} from '../../../config-serializer/config-items/macro-action/MacroAction';

import {DelayMacroAction} from '../../../config-serializer/config-items/macro-action/DelayMacroAction';
import {TextMacroAction} from '../../../config-serializer/config-items/macro-action/TextMacroAction';

import {MouseButtonMacroAction} from '../../../config-serializer/config-items/macro-action/MouseButtonMacroAction';
import {MoveMouseMacroAction} from '../../../config-serializer/config-items/macro-action/MoveMouseMacroAction';
import {ScrollMouseMacroAction} from '../../../config-serializer/config-items/macro-action/ScrollMouseMacroAction';

import {KeyMacroAction} from '../../../config-serializer/config-items/macro-action/KeyMacroAction';

import {KeyModifiers}  from '../../../config-serializer/config-items/KeyModifiers';

import { MacroActionEditorComponent } from '../macro-action-editor/macro-action-editor.component';
import { find as _find } from 'lodash';

// Flatten scancodes for easier label retrieval
// @todo Should this be its own importable file?
const scancodesJSON = require('json!../../popover/tab/keypress/scancodes.json');

function flattenScancodes(data: any[]) {
    let output: any[] = [];
    for (let i = 0, len = data.length; i < len; i++) {
        const group = data[i];
        if (group.children.length) {
            output = output.concat(group.children);
        }
    }
    return output;
}

const scancodes = flattenScancodes(scancodesJSON);

@Component({
    selector: 'macro-item',
    template: require('./macro-item.component.html'),
    styles: [require('./macro-item.component.scss')],
    host: { 'class': 'macro-item' }
})
export class MacroItemComponent implements OnInit, OnChanges {

    @Input() macroAction: MacroAction;
    @Input() editable: boolean;
    @Input() deletable: boolean;
    @Input() moveable: boolean;

    @Output() save = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();
    @Output() edit = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();

    @ViewChild('macroActionEditor') actionEditor: MacroActionEditorComponent;

    private iconName: string;
    private title: string;
    private editing: boolean = false;

    ngOnInit() {
        this.updateView();
    }

    ngOnChanges(changes: any) {
        if (changes.macroAction) {
            this.updateView();
        }
    }

    saveEditedAction(editedAction: MacroAction) {
        // @todo save this to keyboard
        console.log('Saved action', editedAction);
        this.macroAction = editedAction;
        this.editing = false;
        this.updateView();
        this.save.emit();
    }

    editAction() {
        this.actionEditor.toggleEnabled(true);
        this.editing = true;
        this.edit.emit();
    }

    cancelEdit() {
        this.editing = false;
        this.cancel.emit();
    }

    deleteAction() {
        this.delete.emit();
    }

    private updateView(): void {
        this.title = this.macroAction.constructor.name;

        if (this.macroAction instanceof DelayMacroAction) {
            // Delay
            this.iconName = 'clock';
            let action: DelayMacroAction = this.macroAction as DelayMacroAction;
            const delay = action.delay > 0 ? action.delay / 1000 : 0;
            this.title = `Delay of ${delay}s`;
        } else if (this.macroAction instanceof TextMacroAction) {
            // Write text
            let action: TextMacroAction = this.macroAction as TextMacroAction;
            this.iconName = 'font';
            this.title = `Write text: ${action.text}`;
        } else if (this.macroAction instanceof KeyMacroAction) {
            const action: KeyMacroAction = this.macroAction as KeyMacroAction;
            this.setKeyActionContent(action);
        } else if (this.macroAction instanceof MouseButtonMacroAction) {
            const action: MouseButtonMacroAction = this.macroAction as MouseButtonMacroAction;
            this.setMouseButtonActionContent(action);
        } else if (this.macroAction instanceof MoveMouseMacroAction || this.macroAction instanceof ScrollMouseMacroAction) {
            // Mouse moved or scrolled
           this.setMouseMoveScrollActionContent(this.macroAction);
        }
        // TODO: finish for all MacroAction
    }

    private setKeyActionContent(action: KeyMacroAction) {
        if (action.scancode === 0 && !action.modifierMask) {
            this.title = 'Invalid keypress';
            return;
        }

        const actionType = action.macroActionType;
        if (actionType === macroActionType.PressKeyMacroAction || actionType === macroActionType.PressModifiersMacroAction) {
            // Press key
            this.iconName = 'hand-pointer';
            this.title = 'Press key: ';
        } else if (actionType === macroActionType.HoldKeyMacroAction || actionType === macroActionType.HoldModifiersMacroAction) {
            // Hold key
            this.iconName = 'hand-rock';
            this.title = 'Hold key: ';
        } else if (
            actionType === macroActionType.ReleaseKeyMacroAction ||
            actionType === macroActionType.ReleaseModifiersMacroAction
        ) {
            // Release key
            this.iconName = 'hand-paper';
            this.title = 'Release key: ';
        }

        if (action.scancode) {
            const scancode = _find(scancodes, ['id', action.scancode.toString()]);
            if (scancode) {
                this.title += scancode.text;
            }
        }

        if (action.modifierMask) {
            // Press/hold/release modifiers
            for (let i = KeyModifiers.leftCtrl; i !== KeyModifiers.rightGui; i <<= 1) {
                if (action.isModifierActive(i)) {
                    this.title += ' ' + KeyModifiers[i];
                }
            }
        }
    }

    private setMouseMoveScrollActionContent(action: MacroAction) {
        let typedAction: any;
        if (action.macroActionType === macroActionType.MoveMouseMacroAction) {
            this.iconName = 'mouse-pointer';
            this.title = 'Move pointer';
            typedAction = this.macroAction as MoveMouseMacroAction;
        } else {
            // Scroll mouse
            this.iconName = 'mouse-pointer';
            this.title = 'Scroll';
            typedAction = this.macroAction as ScrollMouseMacroAction;
        }

        let needAnd: boolean;
        if (Math.abs(typedAction.x) !== 0) {
            this.title += ` by ${Math.abs(typedAction.x)}px ${typedAction.x > 0 ? 'left' : 'right'}`;
            needAnd = true;
        }
        if (Math.abs(typedAction.y) !== 0) {
            this.title += ` ${needAnd ? 'and' : 'by'} ${Math.abs(typedAction.y)}px ${typedAction.y > 0 ? 'down' : 'up'}`;
        }
    }

    private setMouseButtonActionContent(action: MouseButtonMacroAction) {
        // Press/hold/release mouse buttons
        if (action.macroActionType === macroActionType.PressMouseButtonsMacroAction) {
            this.iconName = 'mouse-pointer';
            this.title = 'Click mouse button: ';
        } else if (action.macroActionType === macroActionType.HoldMouseButtonsMacroAction) {
            this.iconName = 'hand-rock';
            this.title = 'Hold mouse button: ';
        } else if (action.macroActionType === macroActionType.ReleaseMouseButtonsMacroAction) {
            this.iconName = 'hand-paper';
            this.title = 'Release mouse button: ';
        }

        const buttonLabels: string[] = ['Left', 'Middle', 'Right'];
        const selectedButtons: boolean[] = action.getMouseButtons();
        const selectedButtonLabels: string[] = [];
        selectedButtons.forEach((isSelected, idx) => {
            if (isSelected && buttonLabels[idx]) {
                selectedButtonLabels.push(buttonLabels[idx]);
            }
        });
        this.title += selectedButtonLabels.join(', ');
    }
}
