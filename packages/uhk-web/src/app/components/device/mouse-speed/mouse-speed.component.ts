import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, getUserConfiguration } from '../../../store';
import { SetUserConfigurationValueAction } from '../../../store/actions/user-config';
import { DefaultUserConfigurationService } from '../../../services/default-user-configuration.service';
import { SliderPips, SliderProps } from '../../slider-wrapper/slider-wrapper.component';
import { Subscription } from 'rxjs/Subscription';
import { UserConfiguration } from 'uhk-common';
import { ResetMouseSpeedSettingsAction } from '../../../store/actions/device';

const MOUSE_MOVE_VALUE_MULTIPLIER = 25;

@Component({
    selector: 'device-mouse-speed',
    templateUrl: './mouse-speed.component.html',
    styleUrls: ['./mouse-speed.component.scss'],
    host: {
        class: 'container-fluid'
    }
})
export class MouseSpeedComponent implements OnInit, OnDestroy {
    public moveProps = [
        {
            prop: 'mouseMoveInitialSpeed',
            title: 'Initial speed',
            tooltip: 'When mouse movement begins, this is the starting speed.',
            valueUnit: 'px/s',
            value: 0
        },
        {
            prop: 'mouseMoveBaseSpeed',
            title: 'Base speed',
            tooltip: 'This speed is reached after the initial moving speed sufficiently ramps up.',
            valueUnit: 'px/s',
            value: 0
        },
        {
            prop: 'mouseMoveAcceleration',
            title: 'Acceleration',
            tooltip: 'The rate of acceleration from the initial movement speed to the base speed.',
            valueUnit: 'px/s²',
            value: 0
        },
        {
            prop: 'mouseMoveDeceleratedSpeed',
            title: 'Decelerated speed',
            tooltip: 'This speed is used while moving with the <i>decelerate key</i> pressed.',
            valueUnit: 'px/s',
            value: 0
        },
        {
            prop: 'mouseMoveAcceleratedSpeed',
            title: 'Accelerated speed',
            tooltip: 'This speed is used while moving with the <i>accelerate key</i> pressed.',
            valueUnit: 'px/s',
            value: 0
        }
    ];

    public scrollProps = [
        {
            prop: 'mouseScrollInitialSpeed',
            title: 'Initial speed',
            tooltip: 'When mouse scrolling begins, this is the starting speed.',
            valueUnit: 'pulse/s',
            value: 0
        },
        {
            prop: 'mouseScrollBaseSpeed',
            title: 'Base speed',
            tooltip: 'This speed is reached after the initial scrolling speed sufficiently ramps up.',
            valueUnit: 'pulse/s',
            value: 0
        },
        {
            prop: 'mouseScrollAcceleration',
            title: 'Acceleration',
            tooltip: 'The rate of acceleration from the initial scrolling speed to the base speed.',
            valueUnit: 'pulse/s²',
            value: 0
        },
        {
            prop: 'mouseScrollDeceleratedSpeed',
            title: 'Decelerated speed',
            tooltip: 'This speed is used while scrolling with the <i>decelerate key</i> pressed.',
            valueUnit: 'pulse/s',
            value: 0
        },
        {
            prop: 'mouseScrollAcceleratedSpeed',
            title: 'Accelerated speed',
            tooltip: 'This speed is used while scrolling with the <i>accelerate key</i> pressed.',
            valueUnit: 'pulse/s',
            value: 0
        }
    ];

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

    private userConfig$: Store<UserConfiguration>;
    private userConfigSubscription: Subscription;

    constructor(private store: Store<AppState>, private defaultUserConfigurationService: DefaultUserConfigurationService) {}

    ngOnInit(): void {
        this.userConfig$ = this.store.select(getUserConfiguration);
        this.userConfigSubscription = this.userConfig$.subscribe(config => {
            this.moveProps.forEach(moveProp => {
                moveProp.value = config[moveProp.prop] * MOUSE_MOVE_VALUE_MULTIPLIER || 0;
            });
            this.scrollProps.forEach(scrollProp => {
                scrollProp.value = config[scrollProp.prop] || 0;
            });
        });
    }

    ngOnDestroy(): void {
        this.userConfigSubscription.unsubscribe();
    }

    onSetPropertyValue(propertyName: string, value: number): void {
        this.store.dispatch(
            new SetUserConfigurationValueAction({
                propertyName,
                value: propertyName.indexOf('mouseMove') !== -1 ? value / MOUSE_MOVE_VALUE_MULTIPLIER : value
            })
        );
    }

    resetToDefault() {
        this.store.dispatch(new ResetMouseSpeedSettingsAction());
    }
}
