import { RouterConfig } from '@angular/router';
import { KeymapComponent } from './keymap.component';
import { KeymapAddComponent } from './add/keymap-add.component';

export const keymapRoutes: RouterConfig = [
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
