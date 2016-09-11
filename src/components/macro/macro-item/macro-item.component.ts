import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { KeyModifiers } from '../../../config-serializer/config-items/KeyModifiers';
import { 
    DelayMacroAction,
    KeyMacroAction,
    MacroAction,
    MouseButtonMacroAction,
    MoveMouseMacroAction,
    ScrollMouseMacroAction,
    TextMacroAction 
} from '../../../config-serializer/config-items/macro-action';

import { MapperService } from '../../../services/mapper.service';

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

    @Output() save = new EventEmitter<MacroAction>();
    @Output() cancel = new EventEmitter<void>();
    @Output() edit = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();

    private title: string;
    private iconName: string;
    private editing: boolean;

    constructor(private mapper: MapperService) { }

    ngOnInit() {
        this.updateView();
        if (!this.macroAction) {
            this.editing = true;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
         /* tslint:disable:no-string-literal */
        if (changes['macroAction']) {
        /* tslint:enable:no-string-literal */
            this.updateView();
        }
    }

    saveEditedAction(editedAction: MacroAction) {
        // @todo save this to keyboard
        console.log('Saved action', editedAction);
        this.macroAction = editedAction;
        this.editing = false;
        this.updateView();
        this.save.emit(editedAction);
    }

    editAction() {
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

        if (!this.macroAction) {
            this.title = 'New macro action';
        } else if (this.macroAction instanceof DelayMacroAction) {
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
        } else {
            this.title = this.macroAction.constructor.name;
        }
        // TODO: finish for all MacroAction
    }

    private setKeyActionContent(action: KeyMacroAction) {
        if (!action.hasScancode() && !action.hasModifiers()) {
            this.title = 'Invalid keypress';
            return;
        }

        if (action.isPressAction()) {
            // Press key
            this.iconName = 'hand-pointer';
            this.title = 'Press key: ';
        } else if (action.isHoldAction()) {
            // Hold key
            this.iconName = 'hand-rock';
            this.title = 'Hold key: ';
        } else if (action.isReleaseAction()) {
            // Release key
            this.iconName = 'hand-paper';
            this.title = 'Release key: ';
        }

        if (action.hasScancode()) {
            const scancode: string = this.mapper.scanCodeToText(action.scancode).join(' ');
            if (scancode) {
                this.title += scancode;
            }
        }

        if (action.hasModifiers()) {
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
        if (action instanceof MoveMouseMacroAction) {
            // Move mouse pointer
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
        if (action.isOnlyPressAction()) {
            this.iconName = 'mouse-pointer';
            this.title = 'Click mouse button: ';
        } else if (action.isOnlyHoldAction()) {
            this.iconName = 'hand-rock';
            this.title = 'Hold mouse button: ';
        } else if (action.isOnlyReleaseAction()) {
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
