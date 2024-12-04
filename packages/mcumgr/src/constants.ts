/**
 * MCU management operations
 *
 * @readonly
 * @enum {number}
 */
export const MGMT_OP = Object.freeze({
    READ: 0,
    READ_RSP: 1,
    WRITE: 2,
    WRITE_RSP: 3,
});

export type MGMT_OP_KEYS_TYPE = keyof typeof MGMT_OP;
export type MGMT_OP_TYPE = typeof MGMT_OP[MGMT_OP_KEYS_TYPE];

/**
 * Target of the MCU management operation
 *
 * @readonly
 * @enum {number}
 */
export const MGMT_GROUP = Object.freeze({
    OS: 0,
    IMAGE: 1,
    STAT: 2,
    CONFIG: 3,
    LOG: 4,
    CRASH: 5,
    SPLIT: 6,
    RUN: 7,
    FS: 8,
    SHELL: 9,
});

export type MGMT_GROUP_KEYS_TYPE = keyof typeof MGMT_GROUP;
export type MGMT_GROUP_TYPE = typeof MGMT_GROUP[MGMT_GROUP_KEYS_TYPE];

/**
 * Operation of the OS group. Referenced as default operations too.
 *
 * @readonly
 * @enum {number}
 */
export const OS_OPERATION = Object.freeze({
    ECHO: 0,
    CONS_ECHO_CTRL: 1,
    TASK_STAT: 2,
    MP_STAT: 3,
    DATETIME_STR: 4,
    RESET: 5,
});

export type OS_OPERATION_KEYS_TYPE = keyof typeof OS_OPERATION;
export type OS_OPERATION_TYPE = typeof OS_OPERATION[OS_OPERATION_KEYS_TYPE];

/**
 * Operation of the IMAGE group
 *
 * @readonly
 * @enum
 */
export const IMAGE_OPERATION = Object.freeze({
    STATE: 0,
    UPLOAD: 1,
    FILE: 2,
    CORE_LIST: 3,
    CORE_LOAD: 4,
    ERASE: 5,
});

export type IMAGE_OPERATION_KEYS_TYPE = keyof typeof IMAGE_OPERATION;
export type IMAGE_OPERATION_TYPE = typeof IMAGE_OPERATION[IMAGE_OPERATION_KEYS_TYPE];

export type MGMT_OPERATION_TYPE = OS_OPERATION_TYPE | IMAGE_OPERATION_TYPE;
