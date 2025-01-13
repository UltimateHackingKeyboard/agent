import { ChangeDetectorRef } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DragulaService } from '@ert78gb/ng2-dragula';
import { faCircleExclamation, faCircleNodes, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HostConnection } from 'uhk-common';

import { EraseBleSettingsButtonState } from '../../../models';
import { CheckAreHostConnectionsPairedAction, EraseBleSettingAction } from '../../../store/actions/device';
import { DeleteHostConnectionAction } from '../../../store/actions/dongle-pairing.action';
import {
    RenameHostConnectionAction,
    ReorderHostConnectionsAction,
    SetHostConnectionSwitchoverAction,
} from '../../../store/actions/user-config';
import { AppState, getEraseBleSettingsButtonState, getHostConnections, getHostConnectionPairState } from '../../../store/index';

@Component({
    selector: 'host-connections',
    templateUrl: './host-connections.component.html',
    styleUrls: ['./host-connections.component.scss'],
    host: {
        'class': 'container-fluid full-screen-component'
    },
})
export class HostConnectionsComponent implements OnInit, OnDestroy {
    faCircleNodes = faCircleNodes;
    faSpinner = faSpinner;
    faTrash = faTrash;
    faCircleExclamation = faCircleExclamation;

    hostConnectionPairState: Record<string, boolean> = {};
    eraseBleSettingsButtonState: EraseBleSettingsButtonState;
    hostConnections: HostConnection[] = [] as HostConnection[];
    dragAndDropGroup = 'HOST_CONNECTION';

    private hostConnectionPairStateSubscription: Subscription;
    private eraseBleSettingsSubscription: Subscription;
    private hostConnectionsSubscription: Subscription;

    constructor(private dragulaService: DragulaService,
                private cdRef: ChangeDetectorRef,
                private store: Store<AppState>) {

        this.store.dispatch(new CheckAreHostConnectionsPairedAction());

        dragulaService.createGroup(this.dragAndDropGroup, {
            moves: (el, container, handle) => {
                if (!handle) {
                    return false;
                }

                let element = handle;
                while (element) {
                    if (element.classList.contains('movable')) {
                        return true;
                    }
                    element = element.parentElement;
                }

                return false;
            }
        });
    }

    ngOnInit(): void {
        this.eraseBleSettingsSubscription = this.store.select(getEraseBleSettingsButtonState)
            .subscribe(eraseBleSettingsButtonState => {
                this.eraseBleSettingsButtonState = eraseBleSettingsButtonState;
                this.cdRef.markForCheck();
            });
        this.hostConnectionPairStateSubscription = this.store.select(getHostConnectionPairState)
            .subscribe(hostConnectionPairState => {
                this.hostConnectionPairState = hostConnectionPairState;
                this.cdRef.markForCheck();
            });
        this.hostConnectionsSubscription = this.store.select(getHostConnections)
            .subscribe(hostConnections => {
                this.hostConnections = hostConnections;
                this.cdRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this.dragulaService.destroy(this.dragAndDropGroup);
        this.eraseBleSettingsSubscription?.unsubscribe();
        this.hostConnectionPairStateSubscription?.unsubscribe();
        this.hostConnectionsSubscription?.unsubscribe();
    }

    deleteHostConnection(index: number, hostConnection: HostConnection): void {
        this.store.dispatch(new DeleteHostConnectionAction({index, hostConnection}));
    }

    eraseBleSettings(): void {
        this.store.dispatch(new EraseBleSettingAction());
    }

    renameHostConnection(index: number, newName: string): void {
        this.store.dispatch(new RenameHostConnectionAction({
            index,
            newName,
        }));
    }

    hostConnectionsReordered(deviceTargets: HostConnection[]): void {
        this.store.dispatch(new ReorderHostConnectionsAction(deviceTargets));
    }

    setHostConnectionSwitchover(index: number, checked: boolean): void {
        this.store.dispatch(new SetHostConnectionSwitchoverAction({index, checked}));
    }

    showNotPairedTooltip(hostConnection: HostConnection): boolean {
        return hostConnection.hasAddress() && !this.hostConnectionPairState[hostConnection.address];
    }
}
