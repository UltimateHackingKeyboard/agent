import { Routes } from '@angular/router';

import { MacroEditComponent } from './edit/macro-edit.component';

export const macroRoutes: Routes = [
    {
        path: 'macro',
        component: MacroEditComponent
    },
    {
        path: 'macro/:id',
        component: MacroEditComponent
    },
    {
        path: 'macro/:id/:empty',
        component: MacroEditComponent
    }
];
