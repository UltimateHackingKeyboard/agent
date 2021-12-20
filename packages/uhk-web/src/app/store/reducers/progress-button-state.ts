import { Action } from '@ngrx/store';
import * as Device from "../actions/device";

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

export function getSaveToKeyboardButtonState(): ProgressButtonState {
    return {
        showButton: true,
        text: 'Save to keyboard',
        action: new Device.SaveConfigurationAction(true)
    }
}
