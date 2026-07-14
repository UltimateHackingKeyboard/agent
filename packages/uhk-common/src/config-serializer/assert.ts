/* eslint-disable @typescript-eslint/no-explicit-any */

export const INT8_MIN = -0x80;
export const INT8_MAX = 0x7F;
export const INT16_MIN = -0x8000;
export const INT16_MAX = 0x7FFF;
export const INT32_MIN = -0x80000000;
export const INT32_MAX = 0x7FFFFFFF;
export const UINT8_MAX = 0xFF;
export const UINT16_MAX = 0xFFFF;
export const UINT32_MAX = 0xFFFFFFFF;

export function assertUInt8(target: any, key: string) {
    return assertInteger(target, key, 0, UINT8_MAX);
}

export function assertInt8(target: any, key: string) {
    return assertInteger(target, key, INT8_MIN, INT8_MAX);
}

export function assertUInt16(target: any, key: string) {
    return assertInteger(target, key, 0, UINT16_MAX);
}

export function assertInt16(target: any, key: string) {
    return assertInteger(target, key, INT16_MIN, INT16_MAX);
}

export function assertUInt32(target: any, key: string) {
    return assertInteger(target, key, 0, UINT32_MAX);
}

export function assertInt32(target: any, key: string) {
    return assertInteger(target, key, INT32_MIN, INT32_MAX);
}

export function assertFloat(target: any, key: string) {
    return assertInteger(target, key, INT32_MIN, INT32_MAX);
}

export function assertCompactLength(target: any, key: string) {
    return assertUInt16(target, key);
}

function assertInteger(target: any, key: string, min: number, max: number) {
    const priv = '_' + key;

    function getter() {
        return this[priv];
    }

    function setter(newVal: any) {
        if (this[priv] !== newVal) {
            if (newVal < min || newVal > max) {
                throw `${target.constructor.name}.${key}: ` +
                    `Integer ${newVal} is outside the valid [${min}, ${max}] interval`;
            }
            this[priv] = newVal;
        }
    }

    Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
    });
}

export function assertEnum<E>(enumerated: E) {
    return function(target: any, key: string) {
        const priv = '_' + key;

        function getter() {
            return this[priv];
        }

        function setter(newVal: any) {
            if (newVal === undefined) {
                this[priv] = newVal;
            }

            if (this[priv] !== newVal) {
                if (enumerated[newVal] === undefined) {
                    throw `${target.constructor.name}.${key}: ${newVal} is not enum`;
                }
                this[priv] = newVal;
            }
        }

        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    };
}
