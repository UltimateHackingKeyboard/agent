/// <reference path="../../custom_types/sudo-prompt.d.ts"/>
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/takeWhile';

import { remote } from 'electron';
import * as path from 'path';
import * as sudo from 'sudo-prompt';

import { UhkDeviceService } from '../../services/uhk-device.service';
import { ILogService, LOG_SERVICE } from '../../../../shared/src/services/logger.service';

@Component({
    selector: 'privilege-checker',
    templateUrl: 'privilege-checker.component.html',
    styleUrls: ['privilege-checker.component.scss']
})
export class PrivilegeCheckerComponent {

    constructor(private router: Router,
                private uhkDevice: UhkDeviceService,
                @Inject(LOG_SERVICE)private logService: ILogService) {
        uhkDevice.isConnected()
            .distinctUntilChanged()
            .takeWhile(connected => connected)
            .ignoreElements()
            .subscribe({
                complete: () => {
                    router.navigate(['/detection']);
                }
            });
        uhkDevice.isInitialized()
            .distinctUntilChanged()
            .takeWhile(initialized => !initialized)
            .ignoreElements()
            .subscribe({
                complete: () => {
                    router.navigate(['/']);
                }
            });
    }

    setUpPermissions(): void {
        let permissionSetter: Observable<void>;
        switch (process.platform) {
            case 'linux':
                permissionSetter = this.setUpPermissionsOnLinux();
                break;
            case 'win32':
                permissionSetter = this.setUpPermissionsOnWin();
                break;
            default:
                permissionSetter = Observable.throw('Permissions couldn\'t be set. Invalid platform: ' + process.platform);
                break;
        }
        permissionSetter.subscribe({
            error: e => this.logService.error(e),
            complete: () => {
                this.logService.info('Permissions has been successfully set');
                this.uhkDevice.initialize();
                this.router.navigate(['/']);
            }
        });
    }

    private setUpPermissionsOnLinux(): Observable<void> {
        const subject = new ReplaySubject<void>();
        const rootDir = path.resolve(path.join(remote.process.cwd(), remote.process.argv[1]), '..');
        const scriptPath = path.resolve(rootDir, 'rules/setup-rules.sh');
        const options = {
            name: 'Setting UHK access rules'
        };
        sudo.exec(`sh ${scriptPath}`, options, (error: any) => {
            if (error) {
                subject.error(error);
            } else {
                subject.complete();
            }
        });

        return subject.asObservable();
    }

    private setUpPermissionsOnWin(): Observable<void> {
        const subject = new ReplaySubject<void>();
        const rootDir = path.resolve(path.join(remote.process.cwd(), remote.process.argv[1]), '..');
        /**
         * source code: https://github.com/pbatard/libwdi
         */
        const scriptPath = path.resolve(rootDir, `rules/wdi-simple-${process.arch}.exe`);
        const options = {
            name: 'Setting UHK access rules'
        };
        /**
         * The parameters:
             - vid: vendor ID
             - pid: product ID
             - iid: interface ID
             - type: driver type (0=WinUSB, 1=libusb-win32, 2=libusbK, 3=usbser, 4=custom)
             - log: loglevel (0=debug, 1=info, 2=warning, 3=error, 4 = none)
         */
        const command = `${scriptPath} --vid 0x1d50 --pid 0x6122 --iid 0 --type 0 --log 0`;
        sudo.exec(command, options, (error: any) => {
            if (error) {
                subject.error(error);
            } else {
                subject.complete();
            }
        });

        return subject.asObservable();
    }

}
