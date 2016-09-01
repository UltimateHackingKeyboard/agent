import { Routes } from '@angular/router';

import {LegacyLoaderComponent} from './legacy-loader.component';

export const legacyRoutes: Routes = [
    {
        path: 'legacy/:id',
        component: LegacyLoaderComponent
    }
];
