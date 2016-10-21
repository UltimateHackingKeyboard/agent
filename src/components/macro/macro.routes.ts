import { Routes } from '@angular/router';

import { MacroAddComponent } from './add/macro-add.component';
import { MacroEditComponent } from './edit/macro-edit.component';

export const macroRoutes: Routes = [
    {
        path: 'macro',
        component: MacroEditComponent
    },
    {
        path: 'macro/add',
        component: MacroAddComponent
    },
    {
        path: 'macro/:id',
        component: MacroEditComponent
    }
];
