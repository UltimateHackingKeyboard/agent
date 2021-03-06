import { Component } from '@angular/core';

@Component({
    selector: 'multi-device',
    template: `
        <uhk-message header="Multiple UHKs were found."
                     subtitle="Multiple devices aren't supported yet, so please connect only a single device to proceed further."
                     [showLogo]="true"
                     [smallText]="true"
        ></uhk-message>
    `
})
export class MultiDevicePageComponent {}
