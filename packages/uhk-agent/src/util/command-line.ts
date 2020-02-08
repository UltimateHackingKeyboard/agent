/// <reference path="../custom_types/command-line-args.d.ts"/>
/// <reference path="../custom_types/command-line-usage.d.ts"/>

import * as commandLineArgs from 'command-line-args';
import * as commandLineUsage from 'command-line-usage';
import { CommandLineArgs } from 'uhk-common';

const optionDefinitions = [
    { name: 'modules', type: Boolean },
    { name: 'help', type: Boolean },
    { name: 'preserve-udev-rules', type: Boolean },
    { name: 'spe', type: Boolean }, // simulate privilege escalation error
    { name: 'usb-driver', type: String }
];

export const options: CommandLineArgs = commandLineArgs(optionDefinitions, { partial: true });

const sections = [
    {
        header: 'UHK Agent',
        content: 'Ultimate Hacking Keyboard configurator'
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'modules',
                description: 'Make the modules menu visible'
            },
            {
                name: 'preserve-udev-rules',
                description: 'Don\'t force udev rule update'
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
