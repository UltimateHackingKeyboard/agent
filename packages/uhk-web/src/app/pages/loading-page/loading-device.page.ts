import { Component } from '@angular/core';

@Component({
    selector: 'loading-device',
    template: `
        <uhk-message header="Loading keyboard configuration..."
                     subtitle="Hang tight!"
                     [showLogo]="true"
                     [rotateLogo]="true"></uhk-message>
    `
})
export class LoadingDevicePageComponent {

    constructor() {
    }
}
