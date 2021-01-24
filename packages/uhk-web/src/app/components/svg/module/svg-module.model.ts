import { SvgKeyboardKey } from '../keys';

export class SvgModule {
    // circle svg elements that not programmable. Part of the coverages
    circles: any[] = [];
    coverages: any[] = [];
    keyboardKeys: SvgKeyboardKey[];
    attributes: any;
    id: number;

    constructor(obj: { rect: any[], path: any[], $: Object, circle: any[] }) {
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
                // TODO: idSplit.length === 3
            }
        }

        if (obj.circle) {
            const keys = obj.circle.map(circle => circle.$);
            for (let i = 0; i < keys.length; ++i) {
                const circle = keys[i];
                if (circle.id) {
                    const index = keys[i].id.slice(4) - 1; // remove 'key-' then switch to index from 0
                    const style = parseStyle(keys[i].style);
                    keys[i].fill = style.fill;
                    this.keyboardKeys[index] = {
                        type: 'circle',
                        id: circle.id,
                        r: +circle.r,
                        cx: +circle.cx,
                        cy: +circle.cy,
                        fill: style.fill
                    };

                    continue;
                }

                this.circles.push(circle);
            }
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
