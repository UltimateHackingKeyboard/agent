import { Routes } from '@angular/router';

import { AdvancedSettingsPageComponent } from './advanced-settings/advanced-settings.page.component';
import { BatterySettingsComponent } from './battery-settings/battery-settings.component';
import { DeviceConfigurationComponent } from './configuration/device-configuration.component';
import { DeviceFirmwareComponent } from './firmware/device-firmware.component';
import { MouseSpeedComponent } from './mouse-speed/mouse-speed.component';
import { RebootDeviceComponent } from './reboot-device/reboot-device.component';
import { LEDSettingsComponent } from './led-settings/led-settings.component';
import { RestoreUserConfigurationComponent } from './restore-user-configuration/restore-user-configuration.component';
import { HostConnectionsComponent } from './host-connections/host-connections.component';
import { TypingBehaviorPage } from './typing-behavior-page/typing-behavior-page.component';

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
                path: 'battery-settings',
                component: BatterySettingsComponent,
            },
            {
                path: 'configuration',
                component: DeviceConfigurationComponent
            },
            {
                path: 'reboot-reset',
                component: RebootDeviceComponent
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
                component: RestoreUserConfigurationComponent
            },
            {
                path: 'host-connections',
                component: HostConnectionsComponent
            },
            {
                path: 'typing-behavior',
                component: TypingBehaviorPage
            }
        ]
    }
];
