export enum DonglePairingStates {
    Deleting = 'Deleting',
    DeletingSuccess = 'DeletingSuccess',
    DeletingFailed = 'DeletingFailed',
    Idle = 'Idle',
    Pairing = 'Pairing',
    PairingSuccess = 'PairingSuccess',
    PairingFailed = 'PairingFailed',
    SavingToKeyboard = 'SavingToKeyboard',
}

export enum DongleOperations {
    Delete = 'Delete',
    None = 'None',
    Pairing = 'Pairing',
}

export interface DonglePairingState {
    showDonglePairingPanel: boolean;
    operation: DongleOperations;
    state: DonglePairingStates;
}
