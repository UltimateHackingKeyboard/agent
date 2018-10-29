import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { AppState, getPrivilegePageState } from '../../store';
import { SetPrivilegeOnLinuxAction } from '../../store/actions/device';
import { LoadAppStartInfoAction, PrivilegeWhatWillThisDoAction } from '../../store/actions/app';
import { PrivilagePageSate } from '../../models/privilage-page-sate';
import { UdevRulesInfo } from 'uhk-common';

@Component({
    selector: 'privilege-checker',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './privilege-checker.component.html',
    styleUrls: ['./privilege-checker.component.scss']
})

export class PrivilegeCheckerComponent implements OnInit, OnDestroy {

    state: PrivilagePageSate;

    private stateSubscription: Subscription;

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.stateSubscription = this.store.select(getPrivilegePageState)
            .subscribe(state => {
                this.state = state;
                this.cdRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        if (this.stateSubscription) {
            this.stateSubscription.unsubscribe();
        }
    }

    setUpPermissions(): void {
        this.store.dispatch(new SetPrivilegeOnLinuxAction());
    }

    whatWillThisDo(): void {
        this.store.dispatch(new PrivilegeWhatWillThisDoAction());
    }

    retry(): void {
        this.store.dispatch(new LoadAppStartInfoAction());
    }
}
