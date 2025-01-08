import { CommandLineArgs } from 'uhk-common';

export function assertCommandLineOptions (options: CommandLineArgs) {
    if (options['usb-interface'] !== null && options['usb-interface'] !== undefined) {
        if (!options.vid && !options.pid) {
            throw new Error('You have to set the vid, pid commandline options too');
        }

        if (!options.vid) {
            throw new Error('You have to set the vid commandline options too');
        }

        if (!options.pid) {
            throw new Error('You have to set the pid commandline options too');
        }
    }

    if (options.vid && !options.pid) {
        throw new Error('You have to set the pid commandline options too');
    }

    if (!options.vid && options.pid) {
        throw new Error('You have to set the vid commandline options too');
    }

    if (options['report-id'] !== null && options['report-id'] !== undefined && options['no-report-id'] === true) {
        throw new Error('You can not set --report-id and --no-report-id at the same time.');
    }
}
