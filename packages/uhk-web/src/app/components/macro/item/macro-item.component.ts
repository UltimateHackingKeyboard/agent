import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { faGripLinesVertical } from '@fortawesome/free-solid-svg-icons';
import {
    CommandMacroAction,
    DelayMacroAction,
    KeyMacroAction,
    KeyModifiers,
    MacroAction,
    MouseButtons,
    MouseButtonMacroAction,
    MoveMouseMacroAction,
    ScrollMouseMacroAction,
    TextMacroAction
} from 'uhk-common';

import { MapperService } from '../../../services/mapper.service';

@Component({
    animations: [
        trigger('toggler', [
            state('inactive', style({
                height: '0px',
                visibility: 'hidden'
            })),
            state('active', style({
                height: '*',
                visibility: 'visible'
            })),
            transition('inactive <=> active', animate('500ms ease-out'))
        ])
    ],
    selector: 'macro-item',
    templateUrl: './macro-item.component.html',
    styleUrls: ['./macro-item.component.scss'],
    host: { 'class': 'macro-item' }
})
export class MacroItemComponent implements OnInit, OnChanges {
    @Input() macroAction: MacroAction;
    @Input() editable: boolean;
    @Input() editing: boolean;
    @Input() deletable: boolean;
    @Input() movable: boolean;

    @Output() save = new EventEmitter<MacroAction>();
    @Output() cancel = new EventEmitter<void>();
    @Output() edit = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();

    title: string;
    iconName: string;
    newItem: boolean = false;
    overflow = 'hidden';
    faGripLinesVertical = faGripLinesVertical;

    constructor(private mapper: MapperService) { }

    ngOnInit() {
        this.updateView();
        if (!this.macroAction) {
            this.newItem = true;
            this.overflow = 'visible';
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['macroAction']) {
            this.updateView();
        }
    }

    saveEditedAction(editedAction: MacroAction): void {
        this.macroAction = editedAction;
        this.overflow = 'hidden';
        this.updateView();
        this.save.emit(editedAction);
    }

    editAction(): void {
        if (!this.editable || this.editing) {
            this.cancelEdit();
            return;
        }

        this.edit.emit();
        this.setOverflow('visible');
    }

    cancelEdit(): void {
        this.overflow = 'hidden';
        this.cancel.emit();
    }

    deleteAction(): void {
        this.delete.emit();
    }

    private updateView(): void {
        if (!this.macroAction) {
            this.title = 'New macro action';
        } else if (this.macroAction instanceof CommandMacroAction) {
            this.iconName = 'code';
            this.title = 'Command';
        } else if (this.macroAction instanceof DelayMacroAction) {
            // Delay
            this.iconName = 'clock';
            const action: DelayMacroAction = this.macroAction as DelayMacroAction;
            const delay = action.delay > 0 ? action.delay / 1000 : 0;
            this.title = `Delay of ${delay}s`;
        } else if (this.macroAction instanceof TextMacroAction) {
            // Write text
            const action: TextMacroAction = this.macroAction as TextMacroAction;
            this.iconName = 'font';
            this.title = `Write text: ${action.text}`;
        } else if (this.macroAction instanceof KeyMacroAction) {
            // Key pressed/held/released
            const action: KeyMacroAction = this.macroAction as KeyMacroAction;
            this.setKeyActionContent(action);
        } else if (this.macroAction instanceof MouseButtonMacroAction) {
            // Mouse button clicked/held/released
            const action: MouseButtonMacroAction = this.macroAction as MouseButtonMacroAction;
            this.setMouseButtonActionContent(action);
        } else if (this.macroAction instanceof MoveMouseMacroAction || this.macroAction instanceof ScrollMouseMacroAction) {
            // Mouse moved or scrolled
            this.setMouseMoveScrollActionContent(this.macroAction);
        } else {
            this.title = this.macroAction.constructor.name;
        }
    }

    private setKeyActionContent(action: KeyMacroAction): void {
        if (!action.hasScancode() && !action.hasModifiers()) {
            this.title = 'Invalid keypress';
            return;
        }

        if (action.isTapAction()) {
            // Tap key
            this.iconName = 'hand-pointer';
            this.title = 'Tap key: ';
        } else if (action.isPressAction()) {
            // Press key
            this.iconName = 'hand-rock';
            this.title = 'Press key: ';
        } else if (action.isReleaseAction()) {
            // Release key
            this.iconName = 'hand-paper';
            this.title = 'Release key: ';
        }

        const texts = [];

        if (action.hasModifiers()) {
            // Tap/press/release modifiers
            for (let i = KeyModifiers.leftCtrl; i <= KeyModifiers.rightGui; i <<= 1) {
                if (action.isModifierActive(i)) {
                    texts.push(this.mapper.getOsSpecificText(this.mapper.getOsSpecificModifierTextByValue(i)));
                }
            }
        }

        if (action.hasScancode()) {
            const scancode: string = (this.mapper.scanCodeToText(action.scancode, action.type) || ['Unknown']).join(' ');
            if (scancode) {
                texts.push(scancode);
            }
        }

        this.title += texts.join(' + ');
    }

    private setMouseMoveScrollActionContent(action: MacroAction): void {
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
            this.title += ` by ${Math.abs(typedAction.x)}px ${typedAction.x > 0 ? 'rightward' : 'leftward'}`;
            needAnd = true;
        }
        if (Math.abs(typedAction.y) !== 0) {
            this.title += ` ${needAnd ? 'and' : 'by'} ${Math.abs(typedAction.y)}px ${typedAction.y > 0 ? 'downward' : 'upward'}`;
        }
    }

    private setMouseButtonActionContent(action: MouseButtonMacroAction): void {
        // Press/hold/release mouse buttons
        if (action.isOnlyClickAction()) {
            this.iconName = 'mouse-pointer';
            this.title = 'Click mouse button: ';
        } else if (action.isOnlyHoldAction()) {
            this.iconName = 'hand-rock';
            this.title = 'Hold mouse button: ';
        } else if (action.isOnlyReleaseAction()) {
            this.iconName = 'hand-paper';
            this.title = 'Release mouse button: ';
        }

        const selectedButtons: boolean[] = action.getMouseButtons();
        const selectedButtonLabels: string[] = [];
        selectedButtons.forEach((isSelected, idx) => {
            if (isSelected && MouseButtons[idx]) {
                selectedButtonLabels.push(MouseButtons[idx]);
            }
        });
        this.title += selectedButtonLabels.join(', ');
    }

    private setOverflow(value: string): void {
        // tslint:disable: align
        setTimeout(() => {
            this.overflow = value;
        }, 600);
        // tslint:enable: align
    }
}
