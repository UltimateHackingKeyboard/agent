import { Routes } from '@angular/router';

import { KeymapAddComponent } from '../../shared/components/keymap/add/keymap-add.component';
import { KeymapEditComponent } from './edit';
import { KeymapEditGuard } from '../../shared/components/keymap/edit';

export const keymapRoutes: Routes = [
    {
        path: '',
        redirectTo: 'keymap',
        pathMatch: 'full'
    },
    {
        path: 'keymap',
        component: KeymapEditComponent,
        canActivate: [KeymapEditGuard]
    },
    {
        path: 'keymap/add',
        component: KeymapAddComponent
    },
    {
        path: 'keymap/:abbr',
        component: KeymapEditComponent
    }
];
