import { RouterConfig } from '@angular/router';
import {LegacyLoaderComponent} from './legacy-loader.component';

export const legacyRoutes: RouterConfig = [
    {
        path: 'legacy/:id',
        component: LegacyLoaderComponent
    }
];
