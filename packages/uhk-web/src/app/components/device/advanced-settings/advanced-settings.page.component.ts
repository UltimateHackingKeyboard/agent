import { ChangeDetectorRef } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { ToggleI2cDebuggingAction } from '../../../store/actions/advance-settings.action';
import { advanceSettingsState, AppState } from '../../../store';
import { State } from '../../../store/reducers/advanced-settings.reducer';

@Component({
    selector: 'advanced-settings',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'advanced-settings.page.component.html',
    host: {
        'class': 'container-fluid full-screen-component'
    }
})
export class AdvancedSettingsPageComponent implements OnInit, OnDestroy {
    faCog = faCog;

    state: State;

    private subscription: Subscription;
    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.subscription = this.store.select(advanceSettingsState)
            .subscribe(state => {
                this.state = state;
                this.cdRef.detectChanges();
            });
    }

    onToggleI2cDebug(): void {
        this.store.dispatch(new ToggleI2cDebuggingAction());
    }
}
