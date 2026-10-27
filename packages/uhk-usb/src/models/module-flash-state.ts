export const MODULE_FLASH_STATE = Object.freeze({
    Idle: 0,
    Erasing: 1,
    Writing: 2,
    Done: 3,
    Error: 4,
    TryingToReach: 5,
})

export type MODULE_FLASH_STATE_KEY_TYPE = keyof typeof MODULE_FLASH_STATE;
export type MODULE_FLASH_STATE_TYPE = typeof MODULE_FLASH_STATE[MODULE_FLASH_STATE_KEY_TYPE];

const MODULE_FLASH_ERROR_DESCRIPTIONS: Record<number, string> = {
    1: 'the keyboard has no validated module firmware',
    2: 'the module bootloader did not answer the ping',
    3: 'the module bootloader did not send a ping response',
    4: 'sending a command to the module failed',
    5: 'the module did not acknowledge a command',
    6: 'the module did not respond to a command',
    7: 'the module rejected a command',
    8: 'sending firmware data to the module failed',
    9: 'the module reported a failed firmware write',
    10: 'the module did not confirm the firmware write',
};

export const isModuleUnreachableError = (errorCode: number | undefined): boolean => errorCode === 2 || errorCode === 3;

export function describeModuleFlashError(errorCode: number | undefined): string {
    return MODULE_FLASH_ERROR_DESCRIPTIONS[errorCode ?? 0] ?? 'unknown error';
}

export function describeModuleFlashPhase(response: ModuleFlashResponse | undefined): string {
    switch (response?.state) {
        case MODULE_FLASH_STATE.TryingToReach:
            return 'trying to reach the module bootloader';
        case MODULE_FLASH_STATE.Erasing:
            return 'erasing';
        case MODULE_FLASH_STATE.Writing:
            return `writing (${response.writtenBytes}/${response.totalBytes} bytes written)`;
        default:
            return 'starting';
    }
}

export interface ModuleFlashResponse {
    state: MODULE_FLASH_STATE_TYPE;
    errorCode?: number;
    writtenBytes: number;
    /**
     * 0 when the firmware does not report progress
     */
    totalBytes: number;
}

export interface ModuleFlashResult {
    response: ModuleFlashResponse;
    /**
     * The last response before the flashing finished, to tell where it failed
     */
    lastBusyResponse?: ModuleFlashResponse;
}
