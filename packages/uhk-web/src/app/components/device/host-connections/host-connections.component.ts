import { ChangeDetectorRef } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DragulaService } from '@ert78gb/ng2-dragula';
import { faCircleNodes } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HostConnection } from 'uhk-common';

import { RenameHostConnectionAction, ReorderHostConnectionsAction } from '../../../store/actions/user-config';
import { AppState, getHostConnections } from '../../../store/index';

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

    hostConnections: HostConnection[] = [] as HostConnection[];

    dragAndDropGroup = 'HOST_CONNECTION';

    private hostConnectionsSubscription: Subscription;

    constructor(private dragulaService: DragulaService,
                private cdRef: ChangeDetectorRef,
                private store: Store<AppState>) {

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
        this.hostConnectionsSubscription = this.store.select(getHostConnections)
            .subscribe(hostConnections => {
                this.hostConnections = hostConnections;
                this.cdRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this.dragulaService.destroy(this.dragAndDropGroup);
        if(this.hostConnectionsSubscription) {
            this.hostConnectionsSubscription.unsubscribe();
        }
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
}
