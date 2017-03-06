import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/takeWhile';

import { UhkDeviceService } from './../../services/uhk-device.service';

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
