export const MODULE_FLASH_STATE = Object.freeze({
    Idle: 0,
    Erasing: 1,
    Writing: 2,
    Done: 3,
    Error: 4,
})

export type MODULE_FLASH_STATE_KEY_TYPE = keyof typeof MODULE_FLASH_STATE;
export type MODULE_FLASH_STATE_TYPE = typeof MODULE_FLASH_STATE[MODULE_FLASH_STATE_KEY_TYPE];

export interface ModuleFlashResponse {
    state: MODULE_FLASH_STATE_TYPE;
    errorCode?: number;
}
