import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Notification } from '../../models/notification';

@Component({
    selector: 'undoable-notifier',
    templateUrl: './undoable-notifier.component.html',
    styleUrls: ['./undoable-notifier.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(200%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ])
    ]
})
export class UndoableNotifierComponent implements OnChanges {
    text: string;
    undoable: boolean;
    @Input() notification: Notification;
    @Output() close = new EventEmitter();
    @Output() undo = new EventEmitter();

    get slideInOut() {
        return this.notification ? 'in' : 'out';
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['notification']) {
            const not: Notification = changes['notification'].currentValue;
            if (not) {
                this.text = not.message;
                this.undoable = !!not.extra;
            }
        }
    }

    clickOnClose(): void {
        this.close.emit();
    }

    clickOnUndo(): void {
        this.undo.emit(this.notification.extra);
    }
}
