import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { AppState, getPrivilegePageState } from '../../store';
import { SetPrivilegeOnLinuxAction } from '../../store/actions/device';
import { LoadAppStartInfoAction, PrivilegeWhatWillThisDoAction } from '../../store/actions/app';
import { PrivilagePageSate } from '../../models/privilage-page-sate';

@Component({
    selector: 'privilege-checker',
    templateUrl: './privilege-checker.component.html',
    styleUrls: ['./privilege-checker.component.scss']
})
export class PrivilegeCheckerComponent implements OnInit, OnDestroy {

    state: PrivilagePageSate;

    command = `cat <<EOF >/etc/udev/rules.d/50-uhk60.rules
# Ultimate Hacking Keyboard rules
# These are the udev rules for accessing the USB interfaces of the UHK as non-root users.
# Copy this file to /etc/udev/rules.d and physically reconnect the UHK afterwards.
SUBSYSTEMS=="usb", ATTRS{idVendor}=="1d50", ATTRS{idProduct}=="612[0-7]", MODE:="0666"
EOF
udevadm trigger
udevadm settle`;

    private stateSubscription: Subscription;

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.stateSubscription = this.store.select(getPrivilegePageState)
            .subscribe(state => {
                this.state = state;
                this.cdRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        if (this.stateSubscription) {
            this.stateSubscription.unsubscribe();
        }
    }

    setUpPermissions(): void {
        this.store.dispatch(new SetPrivilegeOnLinuxAction());
    }

    whatWillThisDo(): void {
        this.store.dispatch(new PrivilegeWhatWillThisDoAction());
    }

    retry(): void {
        this.store.dispatch(new LoadAppStartInfoAction());
    }
}
