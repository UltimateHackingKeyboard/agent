import { Routes } from '@angular/router';

import { MacroComponent } from './macro.component';

export const macroRoutes: Routes = [
    {
        path: 'macro',
        component: MacroComponent
    },
    {
        path: 'macro/:id',
        component: MacroComponent
    }
];
