import { SvgKeyboardKey } from '../keys';

export class SvgModule {
    // circle svg elements that not programmable. Part of the coverages
    circles: any[] = [];
    coverages: any[] = [];
    keyboardKeys: SvgKeyboardKey[];
    attributes: any;
    id: number;

    constructor(obj: { rect: any[], path: any[], $: Object, circle?: any[], g?: any[] }) {
        this.keyboardKeys = [];
        if (obj.rect) {
            const keys = obj.rect.map(rect => rect.$);
            for (let i = 0; i < keys.length; ++i) {
                const key = keys[i];
                const idSplit = key.id.split('-');
                if (idSplit.length === 2) {
                    const index = idSplit[1] - 1; // remove 'key-' then switch to index from 0
                    keys[i].type = 'rec';
                    keys[i].height = +keys[i].height;
                    keys[i].width = +keys[i].width;
                    const style = parseStyle(keys[i].style);
                    keys[i].fill = style.fill;
                    this.keyboardKeys[index] = keys[i];
                }
            }
        }

        if (obj.circle) {
            this.circles = obj.circle.map(circle => circle.$);
        }

        if (obj.path) {
            const paths = obj.path.map(path => path.$);
            for (let i = 0; i < paths.length; ++i) {
                const path = paths[i];
                if (path.id) {
                    const idSplit = path.id.split('-'); // split the 'key-6{-print}'

                    if (idSplit.length === 2) {
                        const index = idSplit[1] - 1;
                        const style = parseStyle(path.style);

                        this.keyboardKeys[index] = {
                            ...this.keyboardKeys[index],
                            type: 'path',
                            id: path.id,
                            d: path.d,
                            fill: style.fill
                        };
                    } else if (idSplit.length === 3) {
                        // TODO: key-6-print
                    }

                    continue;
                }

                this.coverages.push(path);
            }
        }

        if (obj.g) {
            obj.g.forEach(g => {
                if (g.$.id) {
                    const idSplit = g.$.id.split('-');
                    const index = idSplit[1] - 1;

                    const key: SvgKeyboardKey = {
                        type: 'g',
                        id: g.$.id,
                        transform: g.$.transform,
                        elements: {
                            paths: [],
                            circles: []
                        }
                    };

                    if (g.path) {
                        key.elements.paths = g.path.map(path => {
                            path = path.$;
                            const style = parseStyle(path.style);

                            return {
                                id: path.id,
                                d: path.d,
                                fill: style.fill
                            };
                        });
                    }

                    if (g.circle) {
                        key.elements.circles = g.circle.map(circle => {
                            circle = circle.$;
                            const style = parseStyle(circle.style);

                            return {
                                id: circle.id,
                                r: +circle.r,
                                cx: +circle.cx,
                                cy: +circle.cy,
                                fill: style.fill
                            };
                        });
                    }

                    if (g.rect) {
                        const rect = g.rect.find(r => r.$.id.endsWith('print'));
                        if (rect) {
                            key.height = +rect.$.height;
                            key.width = +rect.$.width;
                            key.textTransform = rect.$.transform;
                        }
                    }
                    this.keyboardKeys[index] = key;
                }
            });
        }

        this.attributes = obj.$;
        this.id = parseInt(obj.$['data-module-id'], 10);
    }
}

function parseStyle(style: string): Record<string, string> | undefined {
    if (!style) {
        return undefined;
    }

    return style
        .split(';')
        .reduce((result: any, value: string) => {
            const split = value.split(':');
            if (split.length < 2) {
                return result;
            }

            result[split[0]] = split[1];

            return  result;
        }, {});
}
