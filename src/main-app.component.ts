import { Component } from '@angular/core';

import { LegacyLoaderComponent } from './components/legacy/legacy-loader.component';
import { SideMenuComponent } from './components/sidemenu/side-menu.component';
import { KeyMapComponent } from './components/keymap/key-map.component';

@Component({
    moduleId: module.id,
    selector: 'main-app',
    templateUrl: 'src/main-app.component.html',
    styles: [require('./main-app.component.scss')],
    directives: [LegacyLoaderComponent, SideMenuComponent, KeyMapComponent]
})
export class MainAppComponent  {
    constructor() {
    }
}
