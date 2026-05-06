import { SvgSeparator } from './svg-separator.model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertXmlToSvgSeparator = (obj: { path: any[], $: Object }): SvgSeparator => {
    return obj.path[0].$;
};
