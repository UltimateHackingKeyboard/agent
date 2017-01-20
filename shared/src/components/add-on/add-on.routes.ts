import { Routes } from '@angular/router';

import { AddOnComponent } from './add-on.component';

export const addOnRoutes: Routes = [
    {
        path: 'add-on/:name',
        component: AddOnComponent
    }
];
