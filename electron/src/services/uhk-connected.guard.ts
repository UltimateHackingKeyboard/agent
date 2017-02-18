import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';

import { UhkDeviceService } from './uhk-device.service';

@Injectable()
export class UHkConnectedGuard implements CanActivate {

    constructor(private uhkDevice: UhkDeviceService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.uhkDevice.isConnected()
            .first()
            .do(connected => {
                if (!connected) {
                    return this.router.navigate(['/detection']);
                }
            });
    }
}
