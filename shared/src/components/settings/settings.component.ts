import { Component } from '@angular/core';

@Component({
    selector: 'settings',
    template: require('./settings.component.html'),
    styles: [require('./settings.component.scss')],
    host: {
        'class': 'container-fluid'
    }
})
export class SettingsComponent {
    constructor() { }
}
