import { Component } from '@angular/core';
import { Router } from '@angular/router';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/takeWhile';

import { UhkDeviceService } from '../../../agent-renderer/services/uhk-device.service';

@Component({
    selector: 'missing-device',
    templateUrl: 'missing-device.component.html'
})
export class MissingDeviceComponent {

    constructor(uhkDevice: UhkDeviceService, router: Router) {
        uhkDevice.isConnected()
            .distinctUntilChanged()
            .takeWhile(connected => !connected)
            .ignoreElements()
            .subscribe({
                complete: () => {
                    router.navigate(['/privilege']);
                }
            });
    }
}
