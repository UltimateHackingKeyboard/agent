import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import { AppState, getBackupUserConfigurationState } from '../../../store';
import { ResetUserConfigurationAction, RestoreUserConfigurationFromBackupAction } from '../../../store/actions/device';
import { RestoreConfigurationState } from '../../../models/restore-configuration-state';

@Component({
    selector: 'restore-configuration',
    templateUrl: './restore-configuration.component.html',
    styleUrls: ['./restore-configuration.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class RestoreConfigurationComponent implements OnInit, OnDestroy {
    state: RestoreConfigurationState;
    faExclamationCircle = faExclamationCircle;

    private stateSubscription: Subscription;

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {
    }

    ngOnDestroy(): void {
        if (this.stateSubscription) {
            this.stateSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.stateSubscription = this.store
            .select(getBackupUserConfigurationState)
            .subscribe(data => {
                this.state = data;
                this.cdRef.markForCheck();
            });
    }

    resetUserConfiguration() {
        this.store.dispatch(new ResetUserConfigurationAction());
    }

    restoreUserConfiguration(): void {
        this.store.dispatch(new RestoreUserConfigurationFromBackupAction());
    }
}
