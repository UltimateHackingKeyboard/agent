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
    .help('help')
    .version(false)
;
