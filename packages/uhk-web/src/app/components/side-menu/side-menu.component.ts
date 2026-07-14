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
    faChevronRight,
    faChevronUp,
    faCog,
    faExclamationTriangle,
    faInfoCircle,
    faKeyboard,
    faPlay,
    faPlus,
    faPuzzlePiece,
    faQuestionCircle,
    faSlidersH,
    faStar
} from '@fortawesome/free-solid-svg-icons';

import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { MAX_ALLOWED_MACROS_TOOLTIP, UHK_80_DEVICE } from 'uhk-common';

import { AppState, getSideMenuPageState } from '../../store';
import { AddMacroAction } from '../../store/actions/macro';
import { RenameUserConfigurationAction } from '../../store/actions/user-config';
import { DeviceUiStates, MacroMenuTreeNode, SideMenuPageState } from '../../models';

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
    standalone: false,
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuComponent implements OnChanges, OnInit, OnDestroy {
    @Input() deviceConfigurationLoaded: boolean;

    isBatterySettingsMenuAllowed: boolean;
    isConnectionsMenuAllowed: boolean;
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
        }
    };
    faCog = faCog;
    faExclamationTriangle = faExclamationTriangle;
    faInfoCircle = faInfoCircle;
    faKeyboard = faKeyboard;
    faPlus = faPlus;
    faPlay = faPlay;
    faPuzzlePiece = faPuzzlePiece;
    faQuestionCircle = faQuestionCircle;
    faSlidersH = faSlidersH;
    faStar = faStar;
    maxAllowedMacrosTooltip = MAX_ALLOWED_MACROS_TOOLTIP;
    macroGroupState: Record<string, SideMenuItemState> = {};

    private stateSubscription: Subscription;

    constructor(private store: Store<AppState>,
                private renderer: Renderer2,
                private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.stateSubscription = this.store.select(getSideMenuPageState).subscribe(data => {
            this.state = data;
            this.isBatterySettingsMenuAllowed = this.state.connectedDevice?.id === UHK_80_DEVICE.id;
            this.isConnectionsMenuAllowed = this.state.connectedDevice?.id === UHK_80_DEVICE.id;
            this.calculateDeviceAnimationState();
            this.syncMacroGroupState();
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

    toggleMacroGroup(path: string): void {
        if (this.state.updatingFirmware) {
            return;
        }

        const currentState = this.getMacroGroupState(path);

        this.macroGroupState[path] = currentState.animation === 'active'
            ? { icon: faChevronDown, animation: 'inactive' }
            : { icon: faChevronUp, animation: 'active' };
    }

    getMacroGroupState(path: string): SideMenuItemState {
        return this.macroGroupState[path] || {
            icon: faChevronUp,
            animation: 'active'
        };
    }

    getMacroGroupArrowIcon(path: string): IconDefinition {
        return this.getMacroGroupState(path).animation === 'active'
            ? faChevronDown
            : faChevronRight;
    }

    getMacroDisplayName(node: MacroMenuTreeNode): string {
        return node.macro?.name || '';
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

    private syncMacroGroupState(): void {
        const nextState: Record<string, SideMenuItemState> = {};

        for (const path of this.collectMacroGroupPaths(this.state?.macroTree || [])) {
            nextState[path] = this.macroGroupState[path] || {
                icon: faChevronUp,
                animation: 'active'
            };
        }

        this.macroGroupState = nextState;
    }

    private collectMacroGroupPaths(nodes: MacroMenuTreeNode[]): string[] {
        return nodes.flatMap(node => {
            if (node.type !== 'group' || !node.path) {
                return [];
            }

            return [node.path, ...this.collectMacroGroupPaths(node.children || [])];
        });
    }
}
