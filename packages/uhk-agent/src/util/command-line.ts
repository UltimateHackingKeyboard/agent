import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { CommandLineArgs } from 'uhk-common';
import { assertCommandLineOptions } from 'uhk-usb';

const optionDefinitions: commandLineArgs.OptionDefinition[] = [
    { name: 'capture-oled', type: String },
    { name: 'devtools', type: Boolean },
    { name: 'disable-agent-update-protection', type: Boolean },
    { name: 'error-simulation', type: String },
    { name: 'ignore-firmware-checksums', type: Boolean },
    { name: 'log', type: String },
    { name: 'help', type: Boolean },
    { name: 'pid', type: Number },
    { name: 'no-report-id', type: Boolean },
    { name: 'preserve-udev-rules', type: Boolean },
    { name: 'print-hardware-configuration', type: Boolean },
    { name: 'print-status-buffer', type: Boolean },
    { name: 'print-usb-devices', type: Boolean },
    { name: 'restore-user-configuration', type: Boolean },
    { name: 'reenumerate-and-exit', type: String },
    { name: 'report-id', type: Number },
    { name: 'serial-number', type: String },
    { name: 'spe', type: Boolean }, // simulate privilege escalation error
    { name: 'usb-interface', type: Number },
    { name: 'usb-non-blocking', type: Boolean },
    { name: 'vid', type: Number },
    { name: 'write-hardware-configuration', type: String },
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
                name: 'capture-oled',
                description: 'Capture UHK 80 OLED content into the given path as png',
                type: String
            },
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
                name: 'ignore-firmware-checksums',
                description: 'Always upgrade firmware of devices and modules even the checksums are same',
                type: Boolean
            },
            {
                name: 'log',
                description: 'Set logging categories. --log=misc,usb. Default is "misc"',
                typeLabel: 'config | misc | usb | usbOps | all'
            },
            {
                name: 'no-report-id',
                description: "Don't use report id for USB communication. The default value depends on the UHK device. You can not set --report-id and --no-report-id at the same time.",
                type: Boolean,
            },
            {
                name: 'pid',
                description: 'Use the specified USB product id. If you set it you have to set the vid too.',
                type: Number
            },
            {
                name: 'preserve-udev-rules',
                description: 'Don\'t force udev rule update',
                type: Boolean
            },
            {
                name: 'print-hardware-configuration',
                description: 'Print hardware configuration to the standard output and exit.',
                type: Boolean
            },
            {
                name: 'print-status-buffer',
                description: 'Print the status buffer of the keyboard to the standard output and exit.',
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
                name: 'restore-user-configuration',
                description: 'Run restore user-configuration process and exit.',
                type: Boolean,
            },
            {
                name: 'report-id',
                description: 'Report Id that used for USB communication. If the value is -1 then does not use report id. The default value depends from the UHK device. For UHK 60 is 0. For UHK 80 is 4',
            },
            {
                name: 'serial-number',
                description: 'Use the specified USB device that serial-number is matching.',
                type: String
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
                description: 'Use the specified USB vendor id. If you set it you have to set the pid too.',
                type: Number
            },
            {
                name: 'write-hardware-configuration',
                description: 'Overwrite/reset the current hardware configuration and exit.',
                typeLabel: 'ansi | iso'
            },
        ]
    }
];

export const cliUsage = commandLineUsage(sections);
