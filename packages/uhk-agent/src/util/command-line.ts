/// <reference path="../custom_types/command-line-args.d.ts"/>
/// <reference path="../custom_types/command-line-usage.d.ts"/>

import * as commandLineArgs from 'command-line-args';
import * as commandLineUsage from 'command-line-usage';
import { CommandLineArgs } from 'uhk-common';

const optionDefinitions = [
    { name: 'addons', type: Boolean },
    { name: 'help', type: Boolean },
    { name: 'preserve-udev-rules', type: Boolean },
    { name: 'spe', type: Boolean }, // simulate privilege escalation error
    { name: 'usbDriver', type: String }
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
                name: 'addons',
                description: 'Addons menu visible'
            },
            {
                name: 'preserve-udev-rules',
                description: 'Agent not force the udev rule update'
            },
            {
                name: 'spe',
                description: 'Simulate privilege escalation error'
            },
            {
                name: 'usbDriver',
                description: 'The driver which is used for firmware upgrade',
                typeLabel: '{underline blhost | kboot}'
            }
        ]
    }
];

export const cliUsage = commandLineUsage(sections);
