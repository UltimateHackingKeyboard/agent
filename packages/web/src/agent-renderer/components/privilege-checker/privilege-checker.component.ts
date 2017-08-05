/// <reference path="../../../custom_types/sudo-prompt.d.ts"/>
import { Component } from '@angular/core';
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

import { LogService } from 'uhk-common';
import { UhkDeviceService } from '../../services/uhk-device.service';

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
            this.rootDir = path.join(path.join(remote.process.cwd(), remote.process.argv[1]), '..');
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
        const scriptPath = path.join(this.rootDir, 'rules/setup-rules.sh');
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
}
