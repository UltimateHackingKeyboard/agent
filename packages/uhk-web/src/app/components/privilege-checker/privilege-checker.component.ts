import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState, getPrivilegePageState, getPlatform } from '../../store';
import { SetPrivilegeOnLinuxAction } from '../../store/actions/device';
import { LoadAppStartInfoAction, PrivilegeWhatWillThisDoAction } from '../../store/actions/app';
import { PrivilagePageSate } from '../../models/privilage-page-sate';

@Component({
    selector: 'privilege-checker',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './privilege-checker.component.html',
    styleUrls: ['./privilege-checker.component.scss'],
    host: {
        'class': 'container-fluid vertical-center-component'
    }
})

export class PrivilegeCheckerComponent implements OnInit, OnDestroy {

    state: PrivilagePageSate;
    platform: string;

    private stateSubscription = new Subscription();

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.stateSubscription.add(
            this.store.select(getPrivilegePageState)
                .subscribe(state => {
                    this.state = state;
                    this.cdRef.markForCheck();
                })
        );

        this.stateSubscription.add(
            this.store.select(getPlatform)
                .subscribe(platform => {
                    this.platform = platform;
                    this.cdRef.markForCheck();
                })
        );
    }

    ngOnDestroy(): void {
        this.stateSubscription.unsubscribe();
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
