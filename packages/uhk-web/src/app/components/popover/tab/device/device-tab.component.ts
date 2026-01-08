import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
    ConnectionCommands,
    ConnectionsAction,
    copyRgbColor,
    HostConnection,
    KeyAction,
    OtherAction,
    OtherActionSubTypes,
} from 'uhk-common';

import { AppState, getHostConnections } from '../../../../store/index';
import { Tab } from '../tab';

const CONNECTIONS_TAB = 0
const SLEEP_TAB = 1

interface HostConnectionListItem {
    name: string;
    command: ConnectionCommands;
    connectionId: number;
}

@Component({
    selector: 'device-tab',
    standalone: false,
    templateUrl: './device-tab.component.html',
    styleUrls: ['./device-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceTabComponent extends Tab implements OnChanges, OnDestroy, OnInit {
    @Input() defaultKeyAction: KeyAction;

    hostConnections: HostConnection[] = [];
    hostConnectionItems: HostConnectionListItem[] = []
    pages = ['Connections', 'Sleep mode'];
    selectedPageIndex = 0;
    selectedHostConnection: HostConnectionListItem = {
        name: 'Next connection',
        command: ConnectionCommands.next,
        connectionId: undefined,
    };

    private hostConnectionsSubscription: Subscription;

    constructor(private store: Store<AppState>, private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit(): void {
        this.hostConnectionsSubscription = this.store.select(getHostConnections)
            .subscribe((connections: HostConnection[]) => {
                this.hostConnections = connections;
                this.setHostConnectionItems();
                this.cdRef.detectChanges();
            });
    }

    ngOnDestroy(): void {
        this.hostConnectionsSubscription?.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.defaultKeyAction) {
            this.fromKeyAction(this.defaultKeyAction);
            this.validAction.emit(this.keyActionValid());
        }
    }

    isConnectionSelected(option: HostConnectionListItem, value: HostConnectionListItem): boolean {
        return option.command === value.command
            && option.connectionId === value.connectionId;
    }

    keyActionValid(): boolean {
        if (this.selectedPageIndex === CONNECTIONS_TAB) {
            return this.selectedHostConnection !== undefined;
        }
        else if (this.selectedPageIndex === SLEEP_TAB) {
            return true;
        }

        return false;
    }

    fromKeyAction(keyAction: KeyAction): boolean {
        if (keyAction instanceof ConnectionsAction) {
            this.selectedPageIndex = CONNECTIONS_TAB;
            this.selectedHostConnection = {
                command: keyAction.command,
                name: '',
                connectionId: keyAction.command === ConnectionCommands.switchByHostConnectionId
                    ? keyAction.hostConnectionId
                    : undefined,
            }

            return true
        }

        if (keyAction instanceof OtherAction) {
            if (keyAction.actionSubtype === OtherActionSubTypes.Sleep) {
                this.selectedPageIndex = SLEEP_TAB
                return true
            }
        }

        return false;
    }

    toKeyAction(): KeyAction {
        if (this.selectedPageIndex === CONNECTIONS_TAB) {
            const action = new ConnectionsAction()
            copyRgbColor(this.defaultKeyAction, action);
            if (this.selectedHostConnection) {
                action.command = this.selectedHostConnection.command;
                if (this.selectedHostConnection.command === ConnectionCommands.switchByHostConnectionId) {
                    action.hostConnectionId = this.selectedHostConnection.connectionId;
                }
            }
            return action
        }

        if (this.selectedPageIndex === SLEEP_TAB) {
            const action = new OtherAction()
            copyRgbColor(this.defaultKeyAction, action);
            action.actionSubtype = OtherActionSubTypes.Sleep

            return action
        }

        return this.defaultKeyAction;
    }

    changePage(index: number) {
        if (index < -1 || index > 3) {
            console.error(`Invalid index error: ${index}`);
            return;
        }

        this.selectedPageIndex = index;
        this.validAction.emit(this.keyActionValid());
    }

    selectHostConnection(connection: HostConnectionListItem) {
        this.selectedHostConnection = connection;
        this.validAction.emit(this.keyActionValid());
    }

    private setHostConnectionItems(): void {
        this.hostConnectionItems = [
            {
                name: 'Next connection',
                command: ConnectionCommands.next,
                connectionId: undefined,
            },
            {
                name: 'Previous connection',
                command: ConnectionCommands.previous,
                connectionId: undefined,
            },
            {
                name: 'Last connection',
                command: ConnectionCommands.last,
                connectionId: undefined,
            },
            ...this.hostConnections.map((hostConnection, index) => {
                const name = hostConnection.name || 'unassigned';

                return {
                    name: `${index + 1}: ${name}`,
                    command: ConnectionCommands.switchByHostConnectionId,
                    connectionId: index,
                }
            })
        ]
    }
}
