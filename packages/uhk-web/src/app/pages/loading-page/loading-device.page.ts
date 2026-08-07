import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, getConfigurationLoadingProgress } from '../../store';

@Component({
    selector: 'loading-device',
    standalone: false,
    template: `
        <uhk-message header="Loading keyboard configuration..."
                     subtitle="Hang tight!"
                     [showLogo]="true"
                     [rotateLogo]="true"
                     [showProgressBar]="true"
                     [progressPercent]="progressPercent$ | async"></uhk-message>
    `,
})
export class LoadingDevicePageComponent {
    progressPercent$: Observable<number>;

    private readonly store = inject<Store<AppState>>(Store);

    constructor() {
        this.progressPercent$ = this.store.select(getConfigurationLoadingProgress);
    }
}
