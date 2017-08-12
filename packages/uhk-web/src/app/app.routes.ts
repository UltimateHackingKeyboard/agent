import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { addOnRoutes } from './components/add-on';
import { keymapRoutes } from './components/keymap';
import { macroRoutes } from './components/macro';
import { PrivilegeCheckerComponent } from './components/privilege-checker/privilege-checker.component';
import { MissingDeviceComponent } from './components/missing-device/missing-device.component';
import { UhkDeviceDisconnectedGuard } from './services/uhk-device-disconnected.guard';
import { UhkDeviceConnectedGuard } from './services/uhk-device-connected.guard';
import { UhkDeviceUninitializedGuard } from './services/uhk-device-uninitialized.guard';
import { MainPage } from './pages/main-page/main.page';

const appRoutes: Routes = [
    {
        path: 'detection',
        component: MissingDeviceComponent,
        canActivate: [UhkDeviceDisconnectedGuard]
    },
    {
        path: 'privilege',
        component: PrivilegeCheckerComponent,
        canActivate: [UhkDeviceConnectedGuard, UhkDeviceUninitializedGuard]
    },
    {
        path: '',
        component: MainPage,
        canActivate: [UhkDeviceConnectedGuard],
        children: [
            ...keymapRoutes,
            ...macroRoutes,
            ...addOnRoutes
        ]
    }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
