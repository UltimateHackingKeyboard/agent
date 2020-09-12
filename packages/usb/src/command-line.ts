import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

export interface CliArg {
    name: string;
    type?: any;
    alias?: string;
    multiple?: boolean;
    lazyMultiple?: boolean;
    defaultOption?: boolean;
    defaultValue?: any;
    group?: string | string[];
    description?: string;
    typeLabel?: string;
}

export interface CliOption {
    description: string;
    args?: CliArg[];
}

function getDefaultCommandLineOptions(): commandLineArgs.OptionDefinition[] {
    return [
        { name: 'help', type: Boolean },
        { name: 'log', type: String }
    ];

}

function getDefaultCommandLineUsage(): commandLineUsage.Section[] {
    return [
        {
            header: 'UHK Agent CLI'
        },
        {
            header: 'Options',
            optionList: [
                {
                    name: 'log',
                    description: 'Set logging categories. --log=misc,usb. Default is "none"',
                    typeLabel: 'none | config | misc | usb | all'
                }
            ]
        }
    ];
}

export function parseCommandLine({ description = '', args = [] }: CliOption): { options: any, usage: any } {
    const optionDefinitions = getDefaultCommandLineOptions();
    const usage = getDefaultCommandLineUsage();
    (usage[0] as commandLineUsage.Content).content = description;
    const optionList = (usage[1] as commandLineUsage.OptionList).optionList;

    for (const arg of args) {
        optionDefinitions.push({
            alias: arg.alias,
            defaultOption: arg.defaultOption,
            defaultValue: arg.defaultValue,
            group: arg.group,
            lazyMultiple: arg.lazyMultiple,
            multiple: arg.multiple,
            name: arg.name,
            type: arg.type
        });

        optionList.push({
            alias: arg.alias,
            defaultOption: arg.defaultOption,
            defaultValue: arg.defaultValue,
            group: arg.group,
            lazyMultiple: arg.lazyMultiple,
            multiple: arg.multiple,
            name: arg.name,
            type: arg.type,
            description: arg.description,
            typeLabel: arg.typeLabel
        });
    }

    const options = commandLineArgs(optionDefinitions, { partial: true });
    const cliUsage = commandLineUsage(usage);

    if (options.help) {
        console.log(cliUsage);
        process.exit(0);
    }

    return {
        usage: cliUsage,
        options
    };
}
