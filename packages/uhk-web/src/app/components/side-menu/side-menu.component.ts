import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Renderer2,
    SimpleChanges
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

import {
    faChevronDown,
    faChevronUp,
    faExclamationTriangle,
    faInfoCircle,
    faKeyboard,
    faPlay,
    faPlus,
    faPuzzlePiece,
    faSlidersH,
    faStar
} from '@fortawesome/free-solid-svg-icons';

import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';

import { AppState, getSideMenuPageState } from '../../store';
import { AddMacroAction } from '../../store/actions/macro';
import { RenameUserConfigurationAction } from '../../store/actions/user-config';
import { DeviceUiStates, SideMenuPageState } from '../../models';

interface SideMenuItemState {
    icon: IconDefinition;
    animation: 'active' | 'inactive';
}

interface SideMenuState {
    [key: string]: SideMenuItemState;

    configuration: SideMenuItemState;
    device: SideMenuItemState;
    keymap: SideMenuItemState;
    macro: SideMenuItemState;
    addon: SideMenuItemState;
    agent: SideMenuItemState;
}

@Component({
    animations: [
        trigger('toggler', [
            state('inactive', style({
                height: '0px'
            })),
            state('active', style({
                height: '*'
            })),
            transition('inactive <=> active', animate('500ms ease-out'))
        ])
    ],
    selector: 'side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuComponent implements OnChanges, OnInit, OnDestroy {
    @Input() deviceConfigurationLoaded: boolean;

    state: SideMenuPageState;
    sideMenuState: SideMenuState = {
        configuration: {
            icon: faChevronUp,
            animation: 'active'
        },
        device: {
            icon: faChevronUp,
            animation: 'active'
        },
        keymap: {
            icon: faChevronUp,
            animation: 'active'
        },
        macro: {
            icon: faChevronUp,
            animation: 'active'
        },
        addon: {
            icon: faChevronUp,
            animation: 'active'
        },
        agent: {
            icon: faChevronUp,
            animation: 'active'
        }
    };
    faExclamationTriangle = faExclamationTriangle;
    faInfoCircle = faInfoCircle;
    faKeyboard = faKeyboard;
    faPlus = faPlus;
    faPlay = faPlay;
    faPuzzlePiece = faPuzzlePiece;
    faSlidersH = faSlidersH;
    faStar = faStar;
    maxAllowedMacros = 255;
    maxAllowedMacrosTooltip = `No more than ${this.maxAllowedMacros} macros are supported.`;

    private stateSubscription: Subscription;

    constructor(private store: Store<AppState>,
                private renderer: Renderer2,
                private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.stateSubscription = this.store.select(getSideMenuPageState).subscribe(data => {
            this.state = data;
            this.calculateDeviceAnimationState();
            this.cdRef.markForCheck();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.deviceConfigurationLoaded) {
            this.calculateDeviceAnimationState();
        }
    }

    ngOnDestroy(): void {
        if (this.stateSubscription) {
            this.stateSubscription.unsubscribe();
        }
    }

    toggleMenuItem(type: string): void {
        if (this.state.updatingFirmware) {
            return;
        }

        if (this.sideMenuState[type].animation === 'active') {
            this.sideMenuState[type] = {
                icon: faChevronDown,
                animation: 'inactive'
            };
        } else {
            this.sideMenuState[type] = {
                icon: faChevronUp,
                animation: 'active'
            };
        }
    }

    addMacro() {
        this.store.dispatch(new AddMacroAction());
    }

    editDeviceName(name: string): void {
        this.store.dispatch(new RenameUserConfigurationAction(name));
    }

    private calculateDeviceAnimationState(): void {
        this.sideMenuState.device.animation = this.deviceConfigurationLoaded
                && this.state?.deviceUiState !== DeviceUiStates.Recovery
                && this.state?.deviceUiState !== DeviceUiStates.UpdateNeeded
            ? 'active'
            : 'inactive';
    }
}
