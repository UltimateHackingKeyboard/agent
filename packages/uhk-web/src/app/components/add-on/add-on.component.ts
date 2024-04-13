import { ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UHK_MODULES } from 'uhk-common';
import { ModuleConfiguration, ModuleId, NavigationMode } from 'uhk-common';

import { AppState, getOperatingSystem, getSelectedModuleConfiguration } from '../../store';
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
    backUrl: string;
    backText: string;
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

    private subscription: Subscription;
    private routeSubscription: Subscription;

    constructor(private route: ActivatedRoute,
                private store:Store<AppState>,
                private cdRef: ChangeDetectorRef) {
        this.subscription = store.select(getSelectedModuleConfiguration)
            .subscribe((moduleConfiguration) => {
                this.moduleConfiguration = moduleConfiguration;

                const module = UHK_MODULES.find(m => m.id === moduleConfiguration.id);
                this.moduleName = module ? module.name : '';

                this.cdRef.markForCheck();
            });
        this.routeSubscription = route.queryParams.subscribe(params => {
            this.backUrl = params.backUrl;
            this.backText = params.backText;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.routeSubscription.unsubscribe();
    }

    onSetModuleConfigurationValue(propertyName: string, value: any) {
        this.store.dispatch(new SetModuleConfigurationValueAction({
            moduleId: this.moduleConfiguration.id,
            propertyName,
            value
        }));
    }
}
