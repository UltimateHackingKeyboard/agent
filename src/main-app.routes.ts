import { provideRouter, RouterConfig }  from '@angular/router';
import { KeymapRoutes } from './components/keymap/keymap.routes';


export const routes: RouterConfig = [
    ...KeymapRoutes
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];