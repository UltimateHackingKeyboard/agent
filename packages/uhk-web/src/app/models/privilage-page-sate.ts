import { UdevRulesInfo } from 'uhk-common';

export interface PrivilagePageSate {
    showWhatWillThisDo: boolean;
    showWhatWillThisDoContent: boolean;
    permissionSetupFailed: boolean;
    updateUdevRules: boolean;
}
