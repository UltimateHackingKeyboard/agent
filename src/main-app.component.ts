import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { SideMenuComponent } from './components/sidemenu/side-menu.component';
import { NotificationComponent } from './components/notification/notification.component';

@Component({
    moduleId: module.id,
    selector: 'main-app',
    template: require('./main-app.component.html'),
    styles: [require('./main-app.component.scss')],
    directives: [SideMenuComponent, ROUTER_DIRECTIVES, NotificationComponent]
})
export class MainAppComponent  {
    constructor() {
    }
}
