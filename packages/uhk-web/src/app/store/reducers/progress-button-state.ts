import { Action } from '@ngrx/store';

export interface ProgressButtonState {
    showButton: boolean;
    firstAttemptOfSaveToKeyboard?: boolean;
    text: string;
    showProgress?: boolean;
    action?: Action;
}

export const initProgressButtonState = {
    showButton: false,
    firstAttemptOfSaveToKeyboard: false,
    text: null,
    showProgress: false
};
