import { provideRouter, RouterConfig }  from '@angular/router';
import { keymapRoutes } from './components/keymap';
import { macroRoutes } from './components/macro';
import { legacyRoutes } from './components/legacy-loader';

export const routes: RouterConfig = [
    ...keymapRoutes,
    ...macroRoutes,
    ...legacyRoutes
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
