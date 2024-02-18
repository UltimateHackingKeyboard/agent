import { ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ModuleConfiguration, ModuleId, NavigationMode } from 'uhk-common';

import { AppState, getSelectedModuleConfiguration } from '../../store';
import { SetModuleConfigurationValueAction } from '../../store/actions/user-config';

@Component({
    selector: 'add-on',
    templateUrl: './add-on.component.html',
    styleUrls: ['./add-on.component.scss'],
    host: {
        'class': 'container-fluid d-block'
    }
})
export class AddOnComponent implements OnDestroy {
    faPuzzlePiece = faPuzzlePiece;
    ModuleId = ModuleId;

    // Touchpad
    pitchToZoomOptions = [
        {
            value:  NavigationMode.Zoom,
            label: 'Zoom'
        },
        {
            value:  NavigationMode.ZoomPc,
            label: 'Zoom PC'
        },
        {
            value:  NavigationMode.ZoomMac,
            label: 'Zoom Mac'
        },
        {
            value:  NavigationMode.None,
            label: 'None'
        }
    ];

    // navigation modes
    navigationModOptions = [
        {
            value: NavigationMode.Cursor,
            label: 'Cursor'
        },
        {
            value: NavigationMode.Media,
            label: 'Media'
        },
        {
            value: NavigationMode.Caret,
            label: 'Caret'
        },
        {
            value: NavigationMode.Zoom,
            label: 'Zoom'
        },
        {
            value: NavigationMode.ZoomPc,
            label: 'Zoom PC'
        },
        {
            value: NavigationMode.ZoomMac,
            label: 'Zoom Mac'
        },
        {
            value: NavigationMode.None,
            label: 'None'
        }
    ];

    moduleConfiguration = new ModuleConfiguration();

    private subscription: Subscription;
    constructor(private store:Store<AppState>,
                private cdRef: ChangeDetectorRef) {
        this.subscription = store.select(getSelectedModuleConfiguration)
            .subscribe((moduleConfiguration) => {
                this.moduleConfiguration = moduleConfiguration;
                this.cdRef.markForCheck();
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onSetModuleConfigurationValue(propertyName: string, value: any) {
        this.store.dispatch(new SetModuleConfigurationValueAction({
            moduleId: this.moduleConfiguration.id,
            propertyName,
            value
        }));
    }
}
