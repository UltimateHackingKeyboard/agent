export interface XtermLog {
    message: string;
    cssClass: XtermCssClass;
}

export enum XtermCssClass {
    standard = 'xterm-standard',
    error = 'xterm-error',
}

export interface ElectronLogEntry {
    level: string;
    message: string;
}
