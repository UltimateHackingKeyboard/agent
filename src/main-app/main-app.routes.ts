import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }  from '@angular/router';
import { keymapRoutes } from '../components/keymap';
import { macroRoutes } from '../components/macro';
import { legacyRoutes } from '../components/legacy-loader';

const appRoutes: Routes = [
    ...keymapRoutes,
    ...macroRoutes,
    ...legacyRoutes
];

export const appRoutingProviders: any[] = [ ];

export const routing: ModuleWithProviders =  RouterModule.forRoot(appRoutes, { useHash: true });
