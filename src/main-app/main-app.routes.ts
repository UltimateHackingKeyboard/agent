import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { addOnRoutes } from '../components/add-on';
import { keymapRoutes } from '../components/keymap';
import { macroRoutes } from '../components/macro';

const appRoutes: Routes = [
    ...keymapRoutes,
    ...macroRoutes,
    ...addOnRoutes
];

export const appRoutingProviders: any[] = [ ];

export const routing: ModuleWithProviders =  RouterModule.forRoot(appRoutes, { useHash: true });
