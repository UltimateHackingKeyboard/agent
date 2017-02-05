import { Component } from '@angular/core';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class SettingsComponent {
    constructor() { }
}
