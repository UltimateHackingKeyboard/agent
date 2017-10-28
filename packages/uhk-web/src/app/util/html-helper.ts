let canvas: HTMLCanvasElement;

export function getContentWidth(style: CSSStyleDeclaration, text: string): number {
    if (!text) {
        return 0;
    }

    if (!canvas) {
        canvas = document.createElement('canvas');
    }

    const context = canvas.getContext('2d');
    context.font = style.font;
    const metrics = context.measureText(text);

    return metrics.width;
}
