function assertUInt8(target: any, key: string) {
    return assertInteger(target, key, 0, 255);
}

function assertInt8(target: any, key: string) {
    return assertInteger(target, key, -128, 127);
}

function assertUInt16(target: any, key: string) {
    return assertInteger(target, key, 0, 65535);
}

function assertInt16(target: any, key: string) {
    return assertInteger(target, key, -32768, 32767);
}

function assertUInt32(target: any, key: string) {
    return assertInteger(target, key, 0, 4294967295);
}

function assertInt32(target: any, key: string) {
    return assertInteger(target, key, -2147483648, 2147483647);
}

function assertCompactLength(target: any, key: string) {
    return assertUInt16(target, key)
}

function assertInteger(target: any, key: string, min: number, max: number) {
    let val = this[key];
    if (delete this[key]) {
        Object.defineProperty(target, key, {
            get: function () {
                return val;
            },
            set: function (newVal) {
                if (newVal < min || newVal > max) {
                    throw `${target.constructor.name}.${key}: ` +
                          `Integer ${newVal} is outside the valid [${min}, ${max}] interval`;
                }
                val = newVal;
            },
            enumerable: true,
            configurable: true
        });
    }
}

function assertEnum<E>(enumerated: E) {
    return function(target: any, key: string) {
        let val = this[key];
        if (delete this[key]) {
            Object.defineProperty(target, key, {
                get: function () {
                    return val;
                },
                set: function (newVal) {
                    if (enumerated[newVal] === undefined) {
                        throw `${target.constructor.name}.${key}: ${newVal} is not enum`;
                    }
                    val = newVal;
                },
                enumerable: true,
                configurable: true
            });
        }
    }
}
