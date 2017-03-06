import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/takeWhile';

import { UhkDeviceService } from './../../services/uhk-device.service';

@Component({
    selector: 'privilege-checker',
    templateUrl: 'privilege-checker.component.html',
    styleUrls: ['privilege-checker.component.scss']
})
export class PrivilegeCheckerComponent {

    constructor(private router: Router, private uhkDevice: UhkDeviceService) {
        uhkDevice.isConnected()
            .distinctUntilChanged()
            .takeWhile(connected => connected)
            .ignoreElements()
            .subscribe({
                complete: () => {
                    router.navigate(['/detection']);
                }
            });

    }

    checkPermissions(): Observable<boolean> {
        return Observable.of(true);
    }

    setUpPermissions() { }

}
