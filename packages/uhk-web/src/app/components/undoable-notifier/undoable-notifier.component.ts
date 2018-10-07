import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { Notification } from 'uhk-common';

@Component({
    selector: 'undoable-notifier',
    templateUrl: './undoable-notifier.component.html',
    styleUrls: ['./undoable-notifier.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger(
            'slideInOut', [
                transition(':enter', [
                    style({transform: 'translateX(100%)'}),
                    animate('400ms ease-in-out', style({transform: 'translateX(0)'}))
                ]),
                transition(':leave', [
                    style({transform: 'translateX(0)'}),
                    animate('400ms ease-in-out', style({transform: 'translateX(100%)'}))
                ])
            ])
    ]
})
export class UndoableNotifierComponent implements OnChanges {
    text: string;
    undoable: boolean;
    @Input() notification: Notification;
    @Output() close = new EventEmitter();
    @Output() undo = new EventEmitter();

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['notification']) {
            const not: Notification = changes['notification'].currentValue;
            if (not) {
                this.text = not.message;
                this.undoable = !!not.extra;
            } else {
                this.text = null;
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
