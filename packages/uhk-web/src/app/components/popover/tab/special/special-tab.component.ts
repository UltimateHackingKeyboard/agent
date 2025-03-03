import {
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HostConnection, KeyAction, SpecialAction } from 'uhk-common';

import { AppState, getHostConnections } from '../../../../store/index';
import { Tab } from '../tab';

@Component({
    selector: 'special-tab',
    templateUrl: './special-tab.component.html',
    styleUrls: ['./special-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecialTabComponent extends Tab implements OnChanges, OnDestroy, OnInit {
    @Input() defaultKeyAction: KeyAction;

    pages = ['Connections', 'Sleep mode'];
    selectedPageIndex = 0;
    hostConnections: HostConnection[] = [];

    private hostConnectionsSubscription: Subscription;

    constructor(private store: Store<AppState>, private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit(): void {
        this. hostConnectionsSubscription = this.store.select(getHostConnections)
            .subscribe((connections: HostConnection[]) => {
                this.hostConnections = connections;
                this.cdRef.detectChanges();
            });
    }

    ngOnDestroy(): void {
        this.hostConnectionsSubscription?.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.fromKeyAction(this.defaultKeyAction);
        this.validAction.emit(this.keyActionValid());
    }

    keyActionValid(): boolean {
        return true;
    }

    fromKeyAction(keyAction: KeyAction): boolean {
        if (!(keyAction instanceof SpecialAction)) {
            return false;
        }
    }

    toKeyAction(): KeyAction {
        return this.defaultKeyAction;
    }

    changePage(index: number) {
        if (index < -1 || index > 3) {
            console.error(`Invalid index error: ${index}`);
            return;
        }

        this.selectedPageIndex = index;
        this.validAction.emit(false);
    }
}
