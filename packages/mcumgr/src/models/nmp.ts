import { MGMT_GROUP_TYPE, MGMT_OP_TYPE, MGMT_OPERATION_TYPE } from '../constants.js';

/**
 * MCU message protocol header.
 * The order of the field follows the binary serialisation order. Please don't reorder.
 */
export interface NmpHeader {
    op: MGMT_OP_TYPE;
    /**
     * 1 byte, not used
     */
    flag: number;
    /**
     * `data` length represented in 2 bytes
     */
    length: number;
    /**
     * Represented in 2 bytes
     */
    group: MGMT_GROUP_TYPE;
    /**
     * Sequence number of the message
     */
    seq: number;
    /**
     * Represented in 1 byte
     */
    id: MGMT_OPERATION_TYPE;
}

export interface NmpResponseData {
    rc?: number;
}

/**
 * MCU message message
 */
export interface NmpResponse<T extends NmpResponseData> extends NmpHeader {
    data?: T;
}

