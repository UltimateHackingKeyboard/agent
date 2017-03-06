import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MissingDeviceComponent } from './../components/missing-device/missing-device.component';
import { PrivilegeCheckerComponent } from './../components/privilege-checker';
import { MainAppComponent } from './../main-app/main-app.component';
import { mainAppRoutes } from './../main-app/main-app.routes';

import { UhkDeviceConnectedGuard } from './../services/uhk-device-connected.guard';
import { UhkDeviceDisconnectedGuard } from './../services/uhk-device-disconnected.guard';
import { UhkDeviceInitializedGuard } from './../services/uhk-device-initialized.guard';
import { UhkDeviceUninitializedGuard } from './../services/uhk-device-uninitialized.guard';

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
        component: MainAppComponent,
        canActivate: [UhkDeviceInitializedGuard],
        children: mainAppRoutes
    }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
