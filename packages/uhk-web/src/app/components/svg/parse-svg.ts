/**
 * Lightweight replacement for the webpack `xml-loader` + `xml2js` combination
 * that was used to turn the keyboard SVG files into plain objects.
 *
 * The output mirrors the default `xml2js` shape that the SVG models expect:
 * attributes are collected under `$`, and child elements are grouped into
 * arrays by their tag name.
 */
export interface SvgXmlElement {
    $: Record<string, string>;
    rect: SvgXmlElement[];
    path: SvgXmlElement[];
    circle: SvgXmlElement[];
    g: SvgXmlElement[];
    [element: string]: Record<string, string> | SvgXmlElement[];
}

const SVG_NAMESPACE_TAGS = new Set(['svg', 'g', 'rect', 'path', 'circle']);

export function parseSvg(xml: string): SvgXmlElement {
    const document = new DOMParser().parseFromString(xml, 'image/svg+xml');
    const root = document.documentElement;

    if (!root || root.nodeName === 'parsererror') {
        throw new Error('Failed to parse SVG');
    }

    return convertElement(root);
}

function convertElement(element: Element): SvgXmlElement {
    const result: SvgXmlElement = {
        $: {},
        rect: [],
        path: [],
        circle: [],
        g: [],
    };

    for (const attribute of Array.from(element.attributes)) {
        result.$[attribute.name] = attribute.value;
    }

    for (const child of Array.from(element.children)) {
        const tag = normalizeTagName(child);
        if (!SVG_NAMESPACE_TAGS.has(tag)) {
            continue;
        }

        (result[tag] as SvgXmlElement[]).push(convertElement(child));
    }

    return result;
}

function normalizeTagName(element: Element): string {
    const tag = element.localName || element.tagName;

    return tag.includes(':') ? tag.slice(tag.indexOf(':') + 1) : tag;
}