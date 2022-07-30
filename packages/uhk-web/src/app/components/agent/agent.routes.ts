import { Routes } from '@angular/router';

import { SettingsComponent } from './settings/settings.component';
import { AboutComponent } from './about/about.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { LedDisplayFontLegendComponent } from '../led-display-font-legend/led-display-font-legend.component'

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
    },
    {
        path: "led-display-legend-demo",
        component: LedDisplayFontLegendComponent,
    },
];
