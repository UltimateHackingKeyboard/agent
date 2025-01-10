export enum BleAddingStates {
    Idle = 'Idle',
    Adding = 'Adding',
    AddingSuccess = 'AddingSuccess',
    SavingToKeyboard = 'SavingToKeyboard',
    TooMuchHostConnections = 'TooMuchHostConnections',
}

export interface BleAddingState {
    showNewPairedDevicesPanel: boolean;
    nrOfNewBleAddresses: number;
    nrOfHostConnections: number;
    state: BleAddingStates;
}
