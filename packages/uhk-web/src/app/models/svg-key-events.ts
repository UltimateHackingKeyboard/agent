export interface SvgKeyClickEvent {
    keyTarget: HTMLElement;
    shiftPressed?: boolean;
    altPressed?: boolean;
}

export interface SvgModuleKeyClickEvent extends SvgKeyClickEvent {
    keyId: number;
}

export interface SvgKeyboardKeyClickEvent extends SvgModuleKeyClickEvent {
    moduleId: number;
}

export interface KeyCaptureData {
    code: number;
    left: boolean[];
    right: boolean[];
}

export interface SvgKeyCaptureEvent {
    captured: KeyCaptureData;
    shiftPressed?: boolean;
    altPressed?: boolean;
}

export interface SvgModuleCaptureEvent extends SvgKeyCaptureEvent {
    keyId: number;
}

export interface SvgKeyboardCaptureEvent extends SvgModuleCaptureEvent {
    moduleId: number;
}

export interface SvgKeyHoverEvent {
    keyId: number;
    event: MouseEvent;
    over: boolean;
    moduleId: number;
    shiftPressed?: boolean;
    altPressed?: boolean;
}
