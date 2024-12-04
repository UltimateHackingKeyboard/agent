export const UHK_DEVICE_IDS = Object.freeze({
    UHK60V1_RIGHT: 1,
    UHK60V2_RIGHT: 2,
    UHK80_LEFT: 3,
    UHK80_RIGHT: 4,
    UHK_DONGLE: 5,
});

export type UHK_DEVICE_IDS_KEY_TYPE = keyof typeof UHK_DEVICE_IDS;
export type UHK_DEVICE_IDS_TYPE = typeof UHK_DEVICE_IDS[UHK_DEVICE_IDS_KEY_TYPE];
