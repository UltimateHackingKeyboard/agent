import {Component, ViewEncapsulation} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { SideMenuComponent } from './components/sidemenu/side-menu.component';

@Component({
    moduleId: module.id,
    selector: 'main-app',
    template: require('./main-app.component.html'),
    styles: [require('./main-app.component.scss')],
    directives: [SideMenuComponent, ROUTER_DIRECTIVES],
    encapsulation: ViewEncapsulation.None
})
export class MainAppComponent  {
    constructor() {
    }
}
