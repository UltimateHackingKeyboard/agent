import { provideRouter, RouterConfig }  from '@angular/router';
import { keymapRoutes } from './components/keymap/keymap.routes';
import { macroRoutes } from './components/macro/macro.routes';
import {legacyRoutes} from './components/legacy/legacy-loader.routes';

export const routes: RouterConfig = [
    ...keymapRoutes,
    ...macroRoutes,
    ...legacyRoutes
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
