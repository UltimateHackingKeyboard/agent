import { RouterConfig } from '@angular/router';
import { KeymapComponent } from './keymap.component';

export const keymapRoutes: RouterConfig = [
    {
        path: '',
        redirectTo: '/keymap',
        terminal: true
    },
    {
        path: 'keymap',
        component: KeymapComponent,
        children: [
            { path: ':id',  component: KeymapComponent },
            { path: '',     component: KeymapComponent }
        ]
    }
];
