import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { addOnRoutes } from '../shared/components/add-on';
import { keymapRoutes } from '../components/keymap';
import { macroRoutes } from '../shared/components/macro';
import { settingsRoutes } from '../shared/components/settings';

const appRoutes: Routes = [
    ...keymapRoutes,
    ...macroRoutes,
    ...addOnRoutes,
    ...settingsRoutes
];

export const appRoutingProviders: any[] = [ ];

export const routing: ModuleWithProviders =  RouterModule.forRoot(appRoutes, { useHash: true });
