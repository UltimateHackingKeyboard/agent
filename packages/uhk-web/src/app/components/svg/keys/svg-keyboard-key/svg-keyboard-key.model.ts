export interface SvgKeyboardKey {
    d?: string;
    id: string;
    x?: string;
    y?: string;
    rx?: string;
    ry?: string;
    height?: number;
    width?: number;
    fill?: string;
    r?: number;
    cx?: number;
    cy?: number;
    transform?: string;
    type: 'circle' | 'path' | 'rec' | 'g';
    elements?: { paths?: Array<any>; rects?: Array<any> };
}
