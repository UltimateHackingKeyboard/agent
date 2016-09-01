import { Routes } from '@angular/router';

import { KeymapAddComponent } from './add/keymap-add.component';
import { KeymapComponent } from './keymap.component';

export const keymapRoutes: Routes = [
    {
        path: '',
        redirectTo: '/keymap',
        pathMatch: 'full'
    },
    {
        path: 'keymap',
        component: KeymapComponent
    },
    {
        path: 'keymap/add',
        component: KeymapAddComponent
    },
    {
        path: 'keymap/:id',
        component: KeymapComponent
    }
];
