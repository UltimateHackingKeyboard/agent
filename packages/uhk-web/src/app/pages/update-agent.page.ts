import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { NewerUserConfiguration } from '../models';
import {
    AppState,
    getNewerUserConfiguration,
    isForceUpdate,
    upgradeAgentTooltip,
} from '../store';
import { ForceUpdateAction } from '../store/actions/app-update.action';
import { CheckAreHostConnectionsPairedAction } from '../store/actions/device';
import { PreviewUserConfigurationAction } from '../store/actions/user-config';

@Component({
    selector: 'update-agent',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
    template: `
        <div class="uhk-message-wrapper">
            <uhk-agent-icon class="agent-logo"></uhk-agent-icon>
            <div>
                <h1>Update Agent</h1>
                <ng-template #upgradeAgentTooltip>
                    <div [innerHTML]="upgradeAgentTooltip$ | async | safeHtml"></div>
                </ng-template>
                <p class="mb-2">
                    Your UHK contains a <span class="text-dotted" [ngbTooltip]="upgradeAgentTooltip" tooltipClass="tooltip-firmware-checksum">newer configuration version</span>
                    than this Agent version can handle, so you must update Agent.
                </p>
                <p>
                    <ng-container *ngIf="newerUserConfiguration?.type === 'backup'">
                        Alternatively, <a href="#"
                               mwlConfirmationPopover
                               popoverTitle="Are you sure?"
                               placement="bottom"
                               confirmText="Yes"
                               cancelText="No"
                               [class.disabled]="isForceUpdate "
                               [isDisabled]="isForceUpdate"
                               (click)="$event.preventDefault()"
                               (confirm)="onRestoreUserConfiguration()">restore the latest configuration available</a>
                        compatible with this Agent version (saved at {{ newerUserConfiguration.date }}), and use this
                        Agent.
                    </ng-container>
                    <ng-container *ngIf="newerUserConfiguration?.type === 'reset'">
                        Alternatively, <a href="#"
                               mwlConfirmationPopover
                               popoverTitle="Are you sure?"
                               placement="bottom"
                               confirmText="Yes"
                               cancelText="No"
                               [class.disabled]="isForceUpdate"
                               [isDisabled]="isForceUpdate"
                               (click)="$event.preventDefault()"
                               (confirm)="onRestoreUserConfiguration()">restore the default configuration</a> and use
                        this Agent version.
                    </ng-container>
                </p>
            </div>
        </div>
        <div style="display: flex; justify-content: center">
            <button class="btn btn-primary btn-lg"
                    [disabled]="isForceUpdate"
                    (click)="onUpdate()"
            >
                Update Agent
                <fa-icon *ngIf="isForceUpdate"
                         [icon]="faSpinner"
                         animation="spin"></fa-icon>
            </button>
        </div>
    `,
    styleUrls: ['../components/uhk-message/uhk-message.component.scss'],
})
export class UpdateAgentPageComponent implements OnDestroy {

    faSpinner = faSpinner;
    isForceUpdate: boolean;
    upgradeAgentTooltip$: Observable<string>;
    newerUserConfiguration: NewerUserConfiguration;

    private subscriptions = new Subscription();

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef,
                private router: Router,) {
        this.subscriptions.add(store.select(isForceUpdate).subscribe(value => {
            this.isForceUpdate = value;
            cdRef.markForCheck();
        }));
        this.subscriptions.add(store.select(getNewerUserConfiguration).subscribe(newerUserConfiguration => {
            this.newerUserConfiguration = newerUserConfiguration
            cdRef.markForCheck();
        }));
        this.upgradeAgentTooltip$ = store.select(upgradeAgentTooltip);
    }

    ngOnDestroy(): void {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }

    onRestoreUserConfiguration(): void {
        const userConfiguration = this.newerUserConfiguration.userConfiguration;
        this.store.dispatch(new PreviewUserConfigurationAction(userConfiguration));
        this.store.dispatch(new CheckAreHostConnectionsPairedAction());
        this.router.navigate(['/']);
    }

    onUpdate(): void {
        this.store.dispatch(new ForceUpdateAction());
    }
}
