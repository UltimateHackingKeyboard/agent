import { CommandLineArgs } from 'uhk-common';

const USB_PROPERTIES = ['vid', 'pid', 'usb-interface'];

export function assertCommandLineOptions (options: CommandLineArgs) {
    let anyUsbOption = false;
    let allUsbOptions = true;

    for (const usbProperty of USB_PROPERTIES) {
        if (options.hasOwnProperty(usbProperty)) {
            anyUsbOption = true;
        } else {
            allUsbOptions = false;
        }
    }

    if (anyUsbOption && !allUsbOptions) {
        throw new Error('You have to set all of the following options: vid, pid, usb-interface');
    }
}
