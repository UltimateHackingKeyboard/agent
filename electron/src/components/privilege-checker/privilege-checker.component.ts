/// <reference path="../../custom_types/sudo-prompt.d.ts"/>
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import * as isDev from 'electron-is-dev';
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
import { LogService } from '../../shared/services/logger.service';

@Component({
    selector: 'privilege-checker',
    templateUrl: 'privilege-checker.component.html',
    styleUrls: ['privilege-checker.component.scss']
})
export class PrivilegeCheckerComponent {

    private rootDir: string;

    constructor(private router: Router,
                private uhkDevice: UhkDeviceService,
                private logService: LogService) {
        if (isDev) {
            this.rootDir = path.resolve(path.join(remote.process.cwd(), remote.process.argv[1]), '..');
        } else {
            this.rootDir = path.dirname(remote.app.getAppPath());
        }
        this.logService.info('App root dir: ', this.rootDir);

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
            // HID API shouldn't need privilege escalation on Windows
            // TODO: If all HID API test success then delete this branch and setUpPermissionsOnWin() method
            // case 'win32':
            //     permissionSetter = this.setUpPermissionsOnWin();
            //     break;
            default:
                permissionSetter = Observable.throw('Permissions couldn\'t be set. Invalid platform: ' + process.platform);
                break;
        }
        permissionSetter.subscribe({
            error: e => {
                console.log(e);
            },
            complete: () => {
                this.logService.info('Permissions has been successfully set');
                this.uhkDevice.initialize();
                this.router.navigate(['/']);
            }
        });
    }

    private setUpPermissionsOnLinux(): Observable<void> {
        const subject = new ReplaySubject<void>();
        const scriptPath = path.resolve(this.rootDir, 'rules/setup-rules.sh');
        const options = {
            name: 'Setting UHK access rules'
        };
        const command = `sh ${scriptPath}`;
        console.log(command);
        sudo.exec(command, options, (error: any) => {
            if (error) {
                subject.error(error);
            } else {
                subject.complete();
            }
        });

        return subject.asObservable();
    }

    // TODO: If all HID API test success then delete this method.
    // and remove zadic-${process.arch}.exe files from windows installer resources
    // private setUpPermissionsOnWin(): Observable<void> {
    //     const subject = new ReplaySubject<void>();
    //
    //      // source code: https://github.com/pbatard/libwdi
    //     const scriptPath = path.resolve(this.rootDir, `rules/zadic-${process.arch}.exe`);
    //     const options = {
    //         name: 'Setting UHK access rules'
    //     };
    //     const params = [
    //         `--vid $\{Constants.VENDOR_ID}`,
    //         `--pid $\{Constants.PRODUCT_ID}`,
    //         '--iface 0', // interface ID
    //         '--usealldevices', // if the device has installed USB driver than overwrite it
    //         '--noprompt' // return at the end of the installation and not waiting for any user command
    //     ];
    //     const paramsString = params.join(' ');
    //     const command = `"${scriptPath}" ${paramsString}`;
    //
    //     sudo.exec(command, options, (error: any) => {
    //         if (error) {
    //             subject.error(error);
    //         } else {
    //             subject.complete();
    //         }
    //     });
    //
    //     return subject.asObservable();
    // }
}
