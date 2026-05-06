export interface SvgKeyboardKey {
    d?: string;
    id: string;
    x?: string | number;
    y?: string | number;
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
    textTransform?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    elements?: { paths?: Array<any>, circles?: Array<any> };
}
