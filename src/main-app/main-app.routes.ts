import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { keymapRoutes } from '../components/keymap';
import { legacyRoutes } from '../components/legacy-loader';
import { macroRoutes } from '../components/macro';

const appRoutes: Routes = [
    ...keymapRoutes,
    ...legacyRoutes,
    ...macroRoutes
];

export const appRoutingProviders: any[] = [ ];

export const routing: ModuleWithProviders =  RouterModule.forRoot(appRoutes, { useHash: true });
