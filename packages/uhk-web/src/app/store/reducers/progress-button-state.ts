import { Action } from '@ngrx/store';

export interface ProgressButtonState {
    showButton: boolean;
    text: string;
    showProgress?: boolean;
    action?: Action;
}

export const initProgressButtonState = {
    showButton: false,
    text: null,
    showProgress: false
};
