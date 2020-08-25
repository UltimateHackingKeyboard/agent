import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { CommandLineArgs } from 'uhk-common';

const optionDefinitions: commandLineArgs.OptionDefinition[] = [
    { name: 'log', type: String },
    { name: 'modules', type: Boolean },
    { name: 'help', type: Boolean },
    { name: 'preserve-udev-rules', type: Boolean },
    { name: 'reenumerate-and-exit', type: String },
    { name: 'spe', type: Boolean }, // simulate privilege escalation error
    { name: 'usb-driver', type: String }
];

export const options: CommandLineArgs = commandLineArgs(optionDefinitions, { partial: true }) as CommandLineArgs;

const sections: commandLineUsage.Section[] = [
    {
        header: 'UHK Agent',
        content: 'Ultimate Hacking Keyboard configurator'
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'log',
                description: 'Set logging categories. --log=misc,usb. Default is "misc"',
                typeLabel: 'config | misc | usb | all'
            },
            {
                name: 'modules',
                description: 'Make the modules menu visible'
            },
            {
                name: 'preserve-udev-rules',
                description: 'Don\'t force udev rule update'
            },
            {
                name: 'reenumerate-and-exit',
                description: 'Reenumerate as the bootloader or BusPal, wait for the specified timeout and exit. ' +
                    'This may make Windows install the USB drivers needed for firmware update. ' +
                    'Please provide the timeout in milliseconds.',
                typeLabel: '(bootloader|buspal),timeout'
            },
            {
                name: 'spe',
                description: 'Simulate privilege escalation error'
            },
            {
                name: 'usb-driver',
                description: 'Use the specified driver for firmware upgrade',
                typeLabel: 'blhost | kboot'
            }
        ]
    }
];

export const cliUsage = commandLineUsage(sections);
