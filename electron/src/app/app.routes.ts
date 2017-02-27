import { UHkConnectedGuard } from './../services/uhk-connected.guard';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MissingDeviceComponent } from './../components/missing-device/missing-device.component';
import { PrivilegeCheckerComponent } from './../components/privilege-checker';
import { MainAppComponent } from './../main-app/main-app.component';
import { mainAppRoutes } from './../main-app/main-app.routes';

const appRoutes: Routes = [
    {
        path: 'detection',
        component: MissingDeviceComponent
    },
    {
        path: 'privilege',
        component: PrivilegeCheckerComponent
    },
    {
        path: '',
        component: MainAppComponent,
        canActivate: [UHkConnectedGuard],
        children: mainAppRoutes
    }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
