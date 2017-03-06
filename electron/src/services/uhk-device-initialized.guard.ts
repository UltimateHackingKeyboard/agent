import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { UhkDeviceService } from './uhk-device.service';

@Injectable()
export class UhkDeviceInitializedGuard implements CanActivate {

    constructor(private uhkDevice: UhkDeviceService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.uhkDevice.isInitialized()
            .do(initialized => {
                if (!initialized) {
                    this.router.navigate(['/detection']);
                }
            });
    }
}
