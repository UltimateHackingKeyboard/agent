import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, getUserConfiguration } from '../../../store';
import { SetUserConfigurationValueAction } from '../../../store/actions/user-config';
import { SliderPips, SliderProps } from '../../slider-wrapper/slider-wrapper.component';
import { Subscription } from 'rxjs';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { ResetPcMouseSpeedSettingsAction, ResetMacMouseSpeedSettingsAction } from '../../../store/actions/device';

const MOUSE_MOVE_VALUE_MULTIPLIER = 25;

@Component({
    selector: 'device-mouse-speed',
    templateUrl: './mouse-speed.component.html',
    styleUrls: ['./mouse-speed.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class MouseSpeedComponent implements OnInit, OnDestroy {
    mouseMoveInitialSpeed: number;
    mouseMoveBaseSpeed: number;
    mouseMoveAcceleration: number;
    mouseMoveDeceleratedSpeed: number;
    mouseMoveAcceleratedSpeed: number;
    mouseMoveAxisSkew: number;

    mouseScrollInitialSpeed: number;
    mouseScrollBaseSpeed: number;
    mouseScrollAcceleration: number;
    mouseScrollDeceleratedSpeed: number;
    mouseScrollAcceleratedSpeed: number;
    mouseScrollAxisSkew: number;

    diagonalSpeedCompensation: boolean;

    public sliderPips: SliderPips = {
        mode: 'positions',
        values: [0, 50, 100],
        density: 6,
        stepped: true
    };

    public moveSettings: SliderProps = {
        min: MOUSE_MOVE_VALUE_MULTIPLIER,
        max: 6375,
        step: MOUSE_MOVE_VALUE_MULTIPLIER
    };

    public scrollSettings: SliderProps = {
        min: 1,
        max: 255,
        step: 1
    };
    faSlidersH = faSlidersH;

    private userConfigSubscription: Subscription;

    constructor(private store: Store<AppState>) {
    }

    ngOnInit(): void {
        this.userConfigSubscription = this.store.select(getUserConfiguration)
            .subscribe(config => {
                this.mouseMoveInitialSpeed = config.mouseMoveInitialSpeed * MOUSE_MOVE_VALUE_MULTIPLIER || 0;
                this.mouseMoveBaseSpeed = config.mouseMoveBaseSpeed * MOUSE_MOVE_VALUE_MULTIPLIER || 0;
                this.mouseMoveAcceleration = config.mouseMoveAcceleration * MOUSE_MOVE_VALUE_MULTIPLIER || 0;
                this.mouseMoveDeceleratedSpeed = config.mouseMoveDeceleratedSpeed * MOUSE_MOVE_VALUE_MULTIPLIER || 0;
                this.mouseMoveAcceleratedSpeed = config.mouseMoveAcceleratedSpeed * MOUSE_MOVE_VALUE_MULTIPLIER || 0;
                this.mouseMoveAxisSkew = config.mouseMoveAxisSkew || 0;

                this.mouseScrollInitialSpeed = config.mouseScrollInitialSpeed || 0;
                this.mouseScrollBaseSpeed = config.mouseScrollBaseSpeed || 0;
                this.mouseScrollAcceleration = config.mouseScrollAcceleration || 0;
                this.mouseScrollDeceleratedSpeed = config.mouseScrollDeceleratedSpeed || 0;
                this.mouseScrollAcceleratedSpeed = config.mouseScrollAcceleratedSpeed || 0;
                this.mouseScrollAxisSkew = config.mouseScrollAxisSkew || 0;

                this.diagonalSpeedCompensation = config.diagonalSpeedCompensation;
            });
    }

    ngOnDestroy(): void {
        if (this.userConfigSubscription) {
            this.userConfigSubscription.unsubscribe();
        }
    }

    onSetMouseMovePropertyValue(propertyName: string, value: number): void {
        this.store.dispatch(new SetUserConfigurationValueAction({
            propertyName,
            value: value / MOUSE_MOVE_VALUE_MULTIPLIER
        }));
    }

    onSetPropertyValue(propertyName: string, value: number): void {
        this.store.dispatch(new SetUserConfigurationValueAction({
            propertyName,
            value: value
        }));
    }

    resetToPcDefault() {
        this.store.dispatch(new ResetPcMouseSpeedSettingsAction());
    }

    resetToMacDefault() {
        this.store.dispatch(new ResetMacMouseSpeedSettingsAction());
    }
}
