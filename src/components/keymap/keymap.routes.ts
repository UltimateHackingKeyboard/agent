import { Routes } from '@angular/router';
import { KeymapComponent } from './keymap.component';
import { KeymapAddComponent } from './add/keymap-add.component';

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
