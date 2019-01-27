import { Routes } from '@angular/router';

import { SettingsComponent } from './settings/settings.component';
import { AboutComponent } from './about/about.component';
import { HelpPageComponent } from './help-page/help-page.component';

export const agentRoutes: Routes = [
    {
        path: 'settings',
        component: SettingsComponent
    },
    {
        path: 'help',
        component: HelpPageComponent
    },
    {
        path: 'about',
        component: AboutComponent
    }
];
