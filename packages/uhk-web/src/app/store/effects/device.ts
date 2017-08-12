import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { NotificationType, IpcResponse } from 'uhk-common';
import { ActionTypes, ConnectionStateChangedAction, PermissionStateChangedAction } from '../actions/device';
import { DeviceRendererService } from '../../services/device-renderer.service';
import { ShowNotificationAction } from '../actions/app';

@Injectable()
export class DeviceEffects {
    @Effect({ dispatch: false })
    deviceConnectionStateChange$: Observable<Action> = this.actions$
        .ofType(ActionTypes.CONNECTION_STATE_CHANGED)
        .map(toPayload)
        .do((connected: boolean) => {
            if (connected) {
                this.router.navigate(['/']);
            }
            else {
                this.router.navigate(['/detection']);
            }
        });

    @Effect({ dispatch: false })
    permissionStateChange$: Observable<Action> = this.actions$
        .ofType(ActionTypes.PERMISSION_STATE_CHANGED)
        .map(toPayload)
        .do((hasPermission: boolean) => {
            if (hasPermission) {
                this.router.navigate(['/detection']);
            }
            else {
                this.router.navigate(['/privilege']);
            }
        });

    @Effect({ dispatch: false })
    setPrivilegeOnLinux$: Observable<Action> = this.actions$
        .ofType(ActionTypes.SET_PRIVILEGE_ON_LINUX)
        .do(() => {
            this.deviceRendererService.setPrivilegeOnLinux();
        });

    @Effect()
    setPrivilegeOnLinuxReply$: Observable<Action> = this.actions$
        .ofType(ActionTypes.SET_PRIVILEGE_ON_LINUX_REPLY)
        .map(toPayload)
        .mergeMap((response: any) => {
            if (response.success) {
                return [
                    new ConnectionStateChangedAction(true),
                    new PermissionStateChangedAction(true)
                ];
            }
            return [
                <any>new ShowNotificationAction({
                    type: NotificationType.Error,
                    message: response.error.message
                })
            ];
        });

    @Effect({ dispatch: false })
    saveLayer$: Observable<Action> = this.actions$
        .ofType(ActionTypes.SAVE_LAYER)
        .map(toPayload)
        .do((buffer: Buffer) => {
            this.deviceRendererService.saveUserConfiguration(buffer);
        });

    @Effect()
    saveLayerReply$: Observable<Action> = this.actions$
        .ofType(ActionTypes.SAVE_LAYER)
        .map(toPayload)
        .map((response: IpcResponse) => {
            if (response.success) {
                return new ShowNotificationAction({
                    type: NotificationType.Success,
                    message: 'Save layer successful.'
                });
            }

            return new ShowNotificationAction({
                type: NotificationType.Error,
                message: response.error.message
            });
        });

    constructor(private actions$: Actions,
                private router: Router,
                private deviceRendererService: DeviceRendererService) {
    }

}
