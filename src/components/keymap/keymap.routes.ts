import { RouterConfig } from '@angular/router';
import { KeymapComponent } from './keymap.component';

export const KeymapRoutes: RouterConfig = [
    {
        path: '',
        redirectTo: '/keymap',
        terminal: true
    },
    {
        path: 'keymap',
        component: KeymapComponent,
        children: [
            {
                path: ':id',
                component: KeymapComponent,
            }
        ]
    }
];