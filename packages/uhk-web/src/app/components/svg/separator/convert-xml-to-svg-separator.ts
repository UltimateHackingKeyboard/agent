import { SvgSeparator } from './svg-separator.model';

export const convertXmlToSvgSeparator = (obj: { path: any[]; $: Object }): SvgSeparator => {
    return obj.path[0].$;
};
