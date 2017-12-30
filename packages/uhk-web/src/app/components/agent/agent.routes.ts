import { Routes } from '@angular/router';

import { SettingsComponent } from './settings/settings.component';
import { AboutComponent } from './about/about.component';

export const agentRoutes: Routes = [
    {
        path: 'settings',
        component: SettingsComponent
    },
    {
        path: 'about',
        component: AboutComponent
    }
];
