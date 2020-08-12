import { getContentWidth } from '../../../../util/html-helper';

export const START_FONT_SIZE = 19;
const MIN_FONT_SIZE = 11;

export function calculateFitFontSize(text: string, width: number): number {
    const reducedWidth = width - 4;

    for (let fontSize = START_FONT_SIZE; fontSize >= MIN_FONT_SIZE; fontSize = fontSize - 0.5) {
        const style = {
            font: `${fontSize}px Helvetica`
        } as CSSStyleDeclaration;

        const calculatedWidth = getContentWidth(style, text);

        if (calculatedWidth < reducedWidth) {
            return fontSize;
        }
    }

    return MIN_FONT_SIZE;
}
