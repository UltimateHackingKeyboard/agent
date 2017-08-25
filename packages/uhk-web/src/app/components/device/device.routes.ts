import { Routes } from '@angular/router';

import { DeviceSettingsComponent } from './settings/device-settings.component';

export const deviceRoutes: Routes = [
    {
        path: '',
        redirectTo: 'device',
        pathMatch: 'full'
    },
    {
        path: 'device/settings',
        component: DeviceSettingsComponent
    }
];
