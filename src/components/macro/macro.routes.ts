import { Routes } from '@angular/router';

import { MacroAddComponent } from './add/macro-add.component';
import { MacroComponent } from './macro.component';

export const macroRoutes: Routes = [
    {
        path: 'macro',
        component: MacroComponent
    },
    {
        path: 'macro/add',
        component: MacroAddComponent
    },
    {
        path: 'macro/:id',
        component: MacroComponent
    }
];
