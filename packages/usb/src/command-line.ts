import Yargs from 'yargs';

export const yargs = Yargs
    .showHelpOnFail(true)
    .option('help', {
        description: 'Display help message'
    })
    .option('log', {
        description: 'Set logging categories. --log=misc,usb. Default is "none"',
        type: 'string',
        default: 'none',
        choices: ['all', 'config', 'misc', 'none', 'usb']
    })
    .option('usb-driver', {
        description: 'Set USB HID driver. It has affect only on Linux OS',
        type: 'string',
        default: 'hidraw',
        choices: ['hidraw', 'libusb']
    })
    .option('usb-read-mode', {
        description: 'How to wait for the USB response',
        type: 'string',
        default: 'readTimeout',
        choices: ['readTimeout', 'onData', 'readSync']
    })
    .help('help')
    .version(false)
;
