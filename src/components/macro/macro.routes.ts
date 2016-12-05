import { Routes } from '@angular/router';

import { MacroEditComponent } from './edit/macro-edit.component';
import { MacroNotFoundComponent } from './not-found';

export const macroRoutes: Routes = [
    {
        path: 'macro',
        component: MacroNotFoundComponent
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
