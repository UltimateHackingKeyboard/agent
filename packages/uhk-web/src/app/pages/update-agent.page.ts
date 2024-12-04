import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AppState, isForceUpdate, upgradeAgentTooltip } from '../store';
import { ForceUpdateAction } from '../store/actions/app-update.action';

@Component({
    selector: 'update-agent',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="uhk-message-wrapper">
            <uhk-agent-icon class="agent-logo"></uhk-agent-icon>
            <div>
                <h1>Update Agent</h1>
                <p>Your UHK contains a <span class="text-dotted" [ngbTooltip]="upgradeAgentTooltip$ | async">newer configuration version</span> than this Agent version can handle, so you must update Agent.</p>
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
                         spin="true"></fa-icon>
            </button>
        </div>
    `,
    styleUrls: ['../components/uhk-message/uhk-message.component.scss'],
})
export class UpdateAgentPageComponent implements OnDestroy {

    faSpinner = faSpinner;
    isForceUpdate: boolean;
    upgradeAgentTooltip$: Observable<string>;

    private subscriptions = new Subscription();

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {
        this.subscriptions.add(store.select(isForceUpdate).subscribe(value => {
            this.isForceUpdate = value;
            cdRef.markForCheck();
        }));
        this.upgradeAgentTooltip$ = store.select(upgradeAgentTooltip);
    }

    ngOnDestroy(): void {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }

    onUpdate(): void {
        this.store.dispatch(new ForceUpdateAction());
    }
}
