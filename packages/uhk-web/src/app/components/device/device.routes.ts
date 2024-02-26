import { Routes } from '@angular/router';

import { AdvancedSettingsPageComponent } from './advanced-settings/advanced-settings.page.component';
import { DeviceConfigurationComponent } from './configuration/device-configuration.component';
import { DeviceFirmwareComponent } from './firmware/device-firmware.component';
import { MouseSpeedComponent } from './mouse-speed/mouse-speed.component';
import { LEDSettingsComponent } from './led-settings/led-settings.component';
import { RestoreConfigurationComponent } from './restore-configuration/restore-configuration.component';
import { TypingBehaviourPage } from './typing-behaviour-page/typing-behaviour-page';

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
                path: 'advanced-settings',
                component: AdvancedSettingsPageComponent
            },
            {
                path: 'configuration',
                component: DeviceConfigurationComponent
            },
            {
                path: 'mouse-key-speed',
                component: MouseSpeedComponent
            },
            {
                path: 'led-settings',
                component: LEDSettingsComponent
            },
            {
                path: 'firmware',
                component: DeviceFirmwareComponent
            },
            {
                path: 'restore-user-configuration',
                component: RestoreConfigurationComponent
            },
            {
                path: 'typing-behaviour',
                component: TypingBehaviourPage
            }
        ]
    }
];
