import { RouterConfig } from '@angular/router';
import { MacroComponent } from './macro.component';

export const macroRoutes: RouterConfig = [
    {
        path: 'macro',
        component: MacroComponent
    },
    {
        path: 'macro/:id',
        component: MacroComponent
    }
];
