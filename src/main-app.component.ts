import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { LegacyLoaderComponent } from './components/legacy/legacy-loader.component';
import { SideMenuComponent } from './components/sidemenu/side-menu.component';
import { KeymapComponent } from './components/keymap/keymap.component';

@Component({
    moduleId: module.id,
    selector: 'main-app',
    template: require('./main-app.component.html'),
    styles: [require('./main-app.component.scss')],
    directives: [LegacyLoaderComponent, SideMenuComponent, KeymapComponent, ROUTER_DIRECTIVES]
})
export class MainAppComponent  {
    constructor() {
    }
}
