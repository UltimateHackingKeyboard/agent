import { assertCommandLineOptions } from 'uhk-usb';
import Yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export const yargs = Yargs(hideBin(process.argv))
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
    .option('no-report-id', {
        description: "Don't use report id for USB communication. The default value depends on the UHK device. You can not set --report-id and --no-report-id at the same time.",
        type: 'boolean',
        default: false,
    })
    .option('pid', {
        description: 'Set USB product id. If you set it you have to set the vid and usb-interface too.',
        type: 'number'
    })
    .option('report-id', {
        description: 'Report Id that used for USB communication. If the value is -1 then does not use report id. The default value depends from the UHK device. For UHK 60 is 0. For UHK 80 is 4',
        type: 'number',
    })
    .option('serial-number', {
        description: 'Use the specified USB device that serial-number is matching.',
        type: 'string',
    })
    .option('usb-non-blocking', {
        description: 'Use USB non blocking communication',
        type: 'boolean',
        default: false
    })
    .option('vid', {
        description: 'Set USB vendor id. If you set it you have to set the pid and usb-interface too.',
        type: 'number'
    })
    .option('usb-interface', {
        description: 'Set USB interface id.  If you set it you have to set the vid and pid too.',
        type: 'number'
    })
    .help('help')
    .version(false)
;

assertCommandLineOptions(yargs.argv);
