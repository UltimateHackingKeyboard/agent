import { Routes } from '@angular/router';

import { DeviceConfigurationComponent } from './configuration/device-configuration.component';
import { DeviceFirmwareComponent } from './firmware/device-firmware.component';
import { MouseSpeedComponent } from './mouse-speed/mouse-speed.component';
import { LEDBrightnessComponent } from './led-brightness/led-brightness.component';

export const deviceRoutes: Routes = [
    {
        path: 'device',
        children: [
            {
                path: '',
                redirectTo: 'configuration',
                pathMatch: 'full'
            },
            {
                path: 'configuration',
                component: DeviceConfigurationComponent
            },
            {
                path: 'mouse-speed',
                component: MouseSpeedComponent
            },
            {
                path: 'led-brightness',
                component: LEDBrightnessComponent
            },
            {
                path: 'firmware',
                component: DeviceFirmwareComponent
            }
        ]
    }
];
