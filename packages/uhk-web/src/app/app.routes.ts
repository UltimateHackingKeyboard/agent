import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { deviceRoutes } from './components/device';
import { addOnRoutes } from './components/add-on';
import { keymapRoutes } from './components/keymap';
import { macroRoutes } from './components/macro';
import { PrivilegeCheckerComponent } from './components/privilege-checker';
import { MissingDeviceComponent } from './components/missing-device';
import { UhkDeviceDisconnectedGuard } from './services/uhk-device-disconnected.guard';
import { UhkDeviceConnectedGuard } from './services/uhk-device-connected.guard';
import { UhkDeviceUninitializedGuard } from './services/uhk-device-uninitialized.guard';
import { UhkDeviceInitializedGuard } from './services/uhk-device-initialized.guard';
import { MainPage } from './pages/main-page/main.page';
import { agentRoutes } from './components/agent';
import { LoadingDevicePageComponent } from './pages/loading-page/loading-device.page';
import { UhkDeviceLoadingGuard } from './services/uhk-device-loading.guard';
import { UhkDeviceLoadedGuard } from './services/uhk-device-loaded.guard';
import { RecoveryModeComponent } from './components/device';
import { UhkDeviceBootloaderNotActiveGuard } from './services/uhk-device-bootloader-not-active.guard';

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
        path: 'loading',
        component: LoadingDevicePageComponent,
        canActivate: [UhkDeviceLoadedGuard]
    },
    {
        path: 'recovery-device',
        component: RecoveryModeComponent,
        canActivate: [UhkDeviceBootloaderNotActiveGuard]
    },
    {
        path: '',
        component: MainPage,
        canActivate: [UhkDeviceDisconnectedGuard, UhkDeviceLoadingGuard],
        children: [
            ...deviceRoutes,
            ...keymapRoutes,
            ...macroRoutes,
            ...addOnRoutes,
            ...agentRoutes
        ]
    }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
