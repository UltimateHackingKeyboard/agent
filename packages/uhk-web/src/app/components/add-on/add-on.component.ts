import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UHK_MODULES } from 'uhk-common';
import { ModuleConfiguration, ModuleId, NavigationMode, TouchpadDragStyle } from 'uhk-common';

import { AppState, getOperatingSystem, getSelectedModuleConfiguration } from '../../store';
import { SetModuleConfigurationValueAction } from '../../store/actions/user-config';

@Component({
    selector: 'add-on',
    standalone: false,
    templateUrl: './add-on.component.html',
    styleUrls: ['./add-on.component.scss'],
    host: {
        'class': 'container-fluid d-block'
    }
})
export class AddOnComponent implements OnDestroy {
    faPuzzlePiece = faPuzzlePiece;
    ModuleId = ModuleId;
    moduleName = '';

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

    dragStyleOptions = [
        {
            value: TouchpadDragStyle.EitherTapAndHold,
            label: 'Either'
        },
        {
            value: TouchpadDragStyle.TapAndHold,
            label: 'Tap and hold'
        },
        {
            value: TouchpadDragStyle.DoubleTapAndHold,
            label: 'Double-tap and hold'
        },
        {
            value: TouchpadDragStyle.None,
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
            value: NavigationMode.Scroll,
            label: 'Scroll'
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

    private readonly cdRef = inject(ChangeDetectorRef);
    private readonly store = inject<Store<AppState>>(Store);
    private subscription: Subscription;

    constructor() {
        this.subscription = this.store.select(getSelectedModuleConfiguration)
            .subscribe((moduleConfiguration) => {
                this.moduleConfiguration = moduleConfiguration;

                const module = UHK_MODULES.find(m => m.id === moduleConfiguration.id);
                this.moduleName = module ? module.name : '';

                this.cdRef.markForCheck();
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    isDoubleTapAndHoldEnabled(): boolean {
        return (this.moduleConfiguration.touchpadDragStyle & TouchpadDragStyle.DoubleTapAndHold) !== 0;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSetModuleConfigurationValue(propertyName: string, value: any) {
        this.store.dispatch(new SetModuleConfigurationValueAction({
            moduleId: this.moduleConfiguration.id,
            propertyName,
            value
        }));
    }
}
