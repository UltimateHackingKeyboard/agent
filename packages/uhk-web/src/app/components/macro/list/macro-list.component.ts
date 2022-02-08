import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    QueryList,
    SimpleChanges,
    ViewChildren
} from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { DragulaService } from 'ng2-dragula';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { KeyMacroAction, KeystrokeAction, Macro, MacroAction, MacroKeySubAction } from 'uhk-common';

import { MacroItemComponent } from '../item';
import { mapLeftRightModifierToKeyActionModifier } from '../../../util';
import { KeyCaptureData } from '../../../models/svg-key-events';
import { SelectedMacroAction, SelectedMacroActionId, TabName } from '../../../models';

const ANIMATION_TIME = 500;
const ANIMATION_INTERVAL = 5;
const ANIMATION_TIMEOUT = ANIMATION_TIME + ANIMATION_INTERVAL;
const CANCEL_ACTION_ANIMATION_TIMEOUT = ANIMATION_TIME + 25;

@Component({
    animations: [
        trigger('toggler', [
            state('inactive', style({
                height: '0px'
            })),
            state('active', style({
                height: '*'
            })),
            transition('inactive => active',
                animate(`${ANIMATION_TIME}ms ease-out`, keyframes([
                    style({ visibility: 'visible', offset: 1 })
                ]))
            ),
            transition('active => inactive',
                animate(`${ANIMATION_TIME}ms ease-out`, keyframes([
                    style({ visibility: 'hidden', offset: 0 })
                ]))
            )
        ]),
        trigger('togglerNew', [
            transition(':enter', [
                style({ height: 0 }),
                animate(`${ANIMATION_TIME}ms ease-out`, style({ height: '*' })
                )
            ]),
            transition(':leave', [
                style({ height: '*' }),
                animate(`${ANIMATION_TIME}ms ease-out`, style({ height: 0 })
                )
            ])
        ])
    ],
    selector: 'macro-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './macro-list.component.html',
    styleUrls: ['./macro-list.component.scss']
})
export class MacroListComponent implements AfterViewChecked, OnChanges, OnDestroy {
    @Input() macro: Macro;
    @Input() macroPlaybackSupported: boolean;
    @Input() isMacroCommandSupported: boolean;
    @Input() selectedMacroAction: SelectedMacroAction;
    @ViewChildren(forwardRef(() => MacroItemComponent)) macroItems: QueryList<MacroItemComponent>;

    @Output() add = new EventEmitter();
    @Output() edit = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() reorder = new EventEmitter();
    @Output() selectedMacroActionChanged = new EventEmitter<SelectedMacroAction>();

    newMacro: Macro = undefined;
    showNew: boolean = false;
    MACRO_ACTIONS = 'macroActions';
    faPlus = faPlus;
    activeEdit: number = undefined;
    scrollTopPosition: number;
    isMacroReordering = false;

    private scrollToBottomIntervalTimer: number;
    private scrollToBottomSetTimeoutTimer: number;

    constructor(private dragulaService: DragulaService) {
        dragulaService.createGroup(this.MACRO_ACTIONS, {
            moves: (el, container, handle) => {
                if (!handle) {
                    return false;
                }

                let element = handle;
                while (element) {
                    if (element.classList.contains('action--movable')) {
                        return true;
                    }
                    element = element.parentElement;
                }

                return false;
            }
        });
    }

    ngAfterViewChecked(): void {
        if (this.scrollTopPosition) {
            window.scrollTo(window.scrollX, this.scrollTopPosition);
            this.scrollTopPosition = undefined;
        }

        if (this.isMacroReordering) {
            this.isMacroReordering = false;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['macro']) {
            this.hideActiveEditor();
        }
    }

    ngOnDestroy(): void {
        this.dragulaService.destroy(this.MACRO_ACTIONS);

        this.clearScrollToBottomInterval();

        if (this.scrollToBottomSetTimeoutTimer) {
            window.clearTimeout(this.scrollToBottomSetTimeoutTimer);
        }
    }

    showNewAction() {
        this.hideActiveEditor();

        this.newMacro = undefined;
        this.showNew = true;
        this.scrollToBottom();
    }

    hideNewAction() {
        this.showNew = false;
        window.setTimeout(() => window.scrollTo(document.body.scrollLeft, document.body.scrollHeight), CANCEL_ACTION_ANIMATION_TIMEOUT);
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
        this.showNew = false;
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
        const keyMacroAction = Object.assign(new KeyMacroAction(), this.toKeyAction(event)) as KeyMacroAction;
        keyMacroAction.action = MacroKeySubAction.tap;

        this.add.emit({
            macroId: this.macro.id,
            action: keyMacroAction
        });
    }

    macroActionReordered(macroActions: MacroAction[]): void {
        this.isMacroReordering = true;
        this.scrollTopPosition = window.scrollY;
        this.reorder.emit({
            macroId: this.macro.id,
            macroActions
        });
    }

    macroActionTrackByFn(index: number, macroAction: MacroAction): string {
        if (this.isMacroReordering) {
            return index.toString() + macroAction.toString();
        }

        return index.toString();
    }

    onSelectedMacroAction(id: SelectedMacroActionId, type: TabName): void {
        this.selectedMacroActionChanged.emit({ id, type });
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
            this.activeEdit = undefined;
        }
    }

    private scrollToBottom(): void {
        this.scrollToBottomIntervalTimer = window.setInterval(() => {
            window.scrollTo(document.body.scrollLeft, document.body.scrollHeight);
        }, ANIMATION_INTERVAL);

        this.scrollToBottomSetTimeoutTimer = window.setTimeout(this.clearScrollToBottomInterval.bind(this), ANIMATION_TIMEOUT);
    }

    private clearScrollToBottomInterval(): void {
        if (this.scrollToBottomIntervalTimer) {
            window.clearInterval(this.scrollToBottomIntervalTimer);
        }
    }
}
