import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState, isForceUpdate } from '../store';
import { ForceUpdateAction } from '../store/actions/app-update.action';

@Component({
    selector: 'update-agent',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="uhk-message-wrapper">
            <img class="agent-logo"
                 src="assets/images/agent-icon.svg"
                 alt="UHK Agent icon"/>
            <div>
                <h1>Update Agent</h1>
                <p>Your UHK contains a newer configuration version than this Agent version can handle, so you
                    must update Agent.</p>
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
    host: {
        'class': 'container-fluid vertical-center-component'
    }
})
export class UpdateAgentPageComponent {

    faSpinner = faSpinner;
    isForceUpdate: boolean;

    private subscriptions = new Subscription();

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {
        this.subscriptions.add(store.select(isForceUpdate).subscribe(value => {
            this.isForceUpdate = value;
            cdRef.markForCheck();
        }));
    }

    onUpdate(): void {
        this.store.dispatch(new ForceUpdateAction());
    }
}
