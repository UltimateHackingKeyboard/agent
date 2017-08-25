import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { deviceRoutes } from './components/device';
import { addOnRoutes } from './components/add-on';
import { keymapRoutes } from './components/keymap';
import { macroRoutes } from './components/macro';
import { PrivilegeCheckerComponent } from './components/privilege-checker/privilege-checker.component';
import { MissingDeviceComponent } from './components/missing-device/missing-device.component';
import { UhkDeviceDisconnectedGuard } from './services/uhk-device-disconnected.guard';
import { UhkDeviceConnectedGuard } from './services/uhk-device-connected.guard';
import { UhkDeviceUninitializedGuard } from './services/uhk-device-uninitialized.guard';
import { UhkDeviceInitializedGuard } from './services/uhk-device-initialized.guard';
import { MainPage } from './pages/main-page/main.page';
import { settingsRoutes } from './components/settings/settings.routes';

const appRoutes: Routes = [
    {
        path: 'detection',
        component: MissingDeviceComponent,
        canActivate: [UhkDeviceConnectedGuard, UhkDeviceUninitializedGuard]
    },
    {
        path: 'privilege',
        component: PrivilegeCheckerComponent,
        canActivate: [UhkDeviceInitializedGuard]
    },
    {
        path: '',
        component: MainPage,
        canActivate: [UhkDeviceDisconnectedGuard],
        children: [
            ...deviceRoutes,
            ...keymapRoutes,
            ...macroRoutes,
            ...addOnRoutes,
            ...settingsRoutes
        ]
    }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
