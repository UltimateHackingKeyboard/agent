import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    Renderer2
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

import {
    faChevronDown,
    faChevronUp,
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
import { SideMenuPageState } from '../../models';

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
export class SideMenuComponent implements OnInit, OnDestroy {
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
    faKeyboard = faKeyboard;
    faPlus = faPlus;
    faPlay = faPlay;
    faPuzzlePiece = faPuzzlePiece;
    faSlidersH = faSlidersH;
    faStar = faStar;

    private stateSubscription: Subscription;

    constructor(private store: Store<AppState>,
                private renderer: Renderer2,
                private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.stateSubscription = this.store.select(getSideMenuPageState).subscribe(data => {
            this.state = data;
            this.cdRef.markForCheck();
        });
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
}
