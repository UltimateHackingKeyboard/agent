import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { UhkDeviceService } from './uhk-device.service';

@Injectable()
export class UhkDeviceConnectedGuard implements CanActivate {

    constructor(private uhkDevice: UhkDeviceService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.uhkDevice.isConnected()
            .do(connected => {
                if (!connected) {
                    this.router.navigate(['/detection']);
                }
            });
    }
}
