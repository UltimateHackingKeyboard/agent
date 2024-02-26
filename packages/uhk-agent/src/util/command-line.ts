import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { CommandLineArgs } from 'uhk-common';
import { assertCommandLineOptions } from 'uhk-usb';

const optionDefinitions: commandLineArgs.OptionDefinition[] = [
    { name: 'devtools', type: Boolean },
    { name: 'disable-agent-update-protection', type: Boolean },
    { name: 'error-simulation', type: String },
    { name: 'log', type: String },
    { name: 'help', type: Boolean },
    { name: 'pid', type: Number },
    { name: 'preserve-udev-rules', type: Boolean },
    { name: 'print-usb-devices', type: Boolean },
    { name: 'reenumerate-and-exit', type: String },
    { name: 'spe', type: Boolean }, // simulate privilege escalation error
    { name: 'usb-interface', type: Number },
    { name: 'usb-non-blocking', type: Boolean },
    { name: 'vid', type: Number },
];

export const options: CommandLineArgs = commandLineArgs(optionDefinitions, { partial: true }) as CommandLineArgs;
assertCommandLineOptions(options);

const sections: commandLineUsage.Section[] = [
    {
        header: 'UHK Agent',
        content: 'Ultimate Hacking Keyboard configurator'
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'devtools',
                description: 'Allow the Developer Tools menu.',
                type: Boolean
            },
            {
                name: 'disable-agent-update-protection',
                description: "Don't show the Agent update screen",
                type: Boolean
            },
            {
                name: 'error-simulation',
                description: 'Simulate an error',
                typeLabel: 'invalid-user-config'
            },
            {
                name: 'log',
                description: 'Set logging categories. --log=misc,usb. Default is "misc"',
                typeLabel: 'config | misc | usb | all'
            },
            {
                name: 'pid',
                description: 'Use the specified USB product id. If you set it you have to set the vid and usb-interface too.',
                type: Number
            },
            {
                name: 'preserve-udev-rules',
                description: 'Don\'t force udev rule update',
                type: Boolean
            },
            {
                name: 'print-usb-devices',
                description: 'Print usb devices to the standard output and exit.',
                type: Boolean
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
                description: 'Simulate privilege escalation error',
                type: Boolean
            },
            {
                name: 'usb-interface',
                description: 'Use the specified USB interface id. If you set it you have to set the vid and pid too.',
                type: Number
            },
            {
                name: 'usb-non-blocking',
                description: 'Use USB non-blocking communication',
                type: Boolean
            },
            {
                name: 'vid',
                description: 'Use the specified USB vendor id. If you set it you have to set the pid and usb-interface too.',
                type: Number
            }
        ]
    }
];

export const cliUsage = commandLineUsage(sections);
