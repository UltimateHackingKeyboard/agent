import { Component } from '@angular/core';

@Component({
    selector: 'loading-device',
    template: `
        <uhk-message title="Loading Agent..."
                     subtitle="Hang tight!"
                     [rotateLogo]="true"></uhk-message>
    `
})
export class LoadingDevicePageComponent {

    constructor() {
    }
}
