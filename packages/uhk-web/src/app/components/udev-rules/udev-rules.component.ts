import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'udev-rules',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './udev-rules.component.html'
})
export class UdevRulesComponent {
    command = `cat <<EOF >/etc/udev/rules.d/50-uhk60.rules
# Ultimate Hacking Keyboard rules
# These are the udev rules for accessing the USB interfaces of the UHK as non-root users.
# Copy this file to /etc/udev/rules.d and physically reconnect the UHK afterwards.
SUBSYSTEM=="input", GROUP="input", MODE="0666"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="1d50", ATTRS{idProduct}=="612[0-7]", TAG+="uaccess"
KERNEL=="hidraw*", ATTRS{idVendor}=="1d50", ATTRS{idProduct}=="612[0-7]", TAG+="uaccess"
EOF
udevadm trigger
udevadm settle`;
}
