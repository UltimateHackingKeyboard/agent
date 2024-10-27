import { Action } from '@ngrx/store';
import { Dongle } from 'uhk-common';
import { DongleOperations, DonglePairingStates } from '../../models';
import * as Device from '../actions/device';
import * as DonglePairing from '../actions/dongle-pairing.action';

export interface State {
    dongle?: Dongle;
    operation: DongleOperations;
    state: DonglePairingStates;
}

export const initialState: State = {
    operation: DongleOperations.None,
    state: DonglePairingStates.Idle,
};

export function reducer(state = initialState, action: Action): State {
    switch (action.type) {

        case Device.ActionTypes.SaveConfiguration: {
            if (state.operation === DongleOperations.None) {
                return state;
            }

            return {
                ...state,
                state: DonglePairingStates.SavingToKeyboard
            };
        }

        case Device.ActionTypes.ConnectionStateChanged: {
            return {
                ...state,
                dongle: (<Device.ConnectionStateChangedAction>action).payload.dongle,
            };
        }

        case Device.ActionTypes.SaveToKeyboardFailed: {
            if (state.state !== DonglePairingStates.SavingToKeyboard) {
                return state;
            }

            let newState = DonglePairingStates.Idle;

            if (state.operation === DongleOperations.Pairing) {
                newState = DonglePairingStates.PairingFailed;
            }
            else if (state.operation === DongleOperations.Delete) {
                newState = DonglePairingStates.DeletingFailed;
            }

            return {
                ...state,
                operation: DongleOperations.None,
                state: newState,
            };
        }

        case DonglePairing.ActionTypes.DeleteHostConnection: {
            return {
                ...state,
                operation: DongleOperations.Delete,
                state: DonglePairingStates.Deleting,
            };
        }

        case DonglePairing.ActionTypes.DeleteHostConnectionFailed: {
            return {
                ...state,
                operation: DongleOperations.None,
                state: DonglePairingStates.DeletingFailed,
            };
        }

        case DonglePairing.ActionTypes.DeleteHostConnectionSuccess: {
            return {
                ...state,
                state: DonglePairingStates.SavingToKeyboard,
            };
        }

        case Device.ActionTypes.SaveToKeyboardSuccess: {
            if (state.state !== DonglePairingStates.SavingToKeyboard) {
                return state;
            }

            let newState = DonglePairingStates.Idle;
            if (state.operation === DongleOperations.Pairing) {
                newState = DonglePairingStates.PairingSuccess;
            }
            else if (state.operation === DongleOperations.Delete) {
                newState = DonglePairingStates.DeletingSuccess;
            }

            return {
                ...state,
                operation: DongleOperations.None,
                state: newState,
            };
        }

        case DonglePairing.ActionTypes.StartDonglePairing: {
            return {
                ...state,
                operation: DongleOperations.Pairing,
                state: DonglePairingStates.Pairing,
            };
        }

        case DonglePairing.ActionTypes.DonglePairingFailed: {
            return {
                ...state,
                operation: DongleOperations.None,
                state: DonglePairingStates.PairingFailed,
            };
        }

        case DonglePairing.ActionTypes.DonglePairingSuccess: {
            return {
                ...state,
                state: DonglePairingStates.SavingToKeyboard,
            };
        }

        default:
            return state;
    }
}

export const isDonglePairing = (state: State): boolean => {
    return (state.operation === DongleOperations.Pairing && state.state === DonglePairingStates.SavingToKeyboard) || state.state === DonglePairingStates.Pairing;
};
export const getDongle = (state: State): Dongle => state.dongle;
