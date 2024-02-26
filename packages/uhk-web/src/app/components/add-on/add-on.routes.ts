import { Routes } from '@angular/router';

import { AddOnComponent } from './add-on.component';

export const addOnRoutes: Routes = [
    {
        path: 'add-on/key-cluster',
        component: AddOnComponent
    },
    {
        path: 'add-on/trackball',
        component: AddOnComponent
    },
    {
        path: 'add-on/trackpoint',
        component: AddOnComponent
    },
    {
        path: 'add-on/touchpad',
        component: AddOnComponent
    }
];
