export interface DebugInfo {
    i2cWatchdog: number;
    i2cSlaveSchedulerCounter: number;
    i2cWatchdogWatchCounter: number;
    i2cWatchdogRecoveryCounter: number;
    keyScannerCounter: number;
    usbReportUpdateCounter: number;
    currentTime: number;
    usbGenericHidActionCounter: number;
    usbBasicKeyboardActionCounter: number;
    usbMediaKeyboardActionCounter: number;
    usbSystemKeyboardActionCounter: number;
    usbMouseActionCounter: number;
}
