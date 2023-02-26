export interface RgbColorInterface {
    b: number;
    g: number;
    r: number;
}

export function defaultRgbColor(): RgbColorInterface {
    return { b: 255, g: 255, r: 255 };
}
