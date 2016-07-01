import { RouterConfig } from '@angular/router';
import { KeymapComponent } from './keymap.component';

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
        path: 'keymap/:id',
        component: KeymapComponent
    }
];
