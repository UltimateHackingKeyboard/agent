import { IconDefinition, IconName } from '@fortawesome/fontawesome-common-types';

const prefix = 'far';
const iconName = 'faBatteryFull';
const width = 576;
const height = 512;
const ligatures = [];
const unicode = undefined;
const svgPathData = 'M464 144c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32L80 368c-17.7 0-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32l384 0zM80 96C35.8 96 0 131.8 0 176L0 336c0 44.2 35.8 80 80 80l384 0c44.2 0 80-35.8 80-80l0-16c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l0-16c0-44.2-35.8-80-80-80L80 96zm368 96L96 192l0 128 352 0 0-128z';

export const faBatteryFull: IconDefinition = {
    prefix: prefix,
    iconName: iconName as IconName,
    icon: [
        width,
        height,
        ligatures,
        unicode,
        svgPathData
    ]
};
