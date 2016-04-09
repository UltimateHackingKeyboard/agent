function assertUInt8(target: any, key: string) {
    return assertInteger(target, key, 0, 0xFF);
}

function assertInt8(target: any, key: string) {
    return assertInteger(target, key, -0x80, 0x7F);
}

function assertUInt16(target: any, key: string) {
    return assertInteger(target, key, 0, 0xFFFF);
}

function assertInt16(target: any, key: string) {
    return assertInteger(target, key, -0x8000, 0x7FFF);
}

function assertUInt32(target: any, key: string) {
    return assertInteger(target, key, 0, 0xFFFFFFFF);
}

function assertInt32(target: any, key: string) {
    return assertInteger(target, key, -0x80000000, 0x7FFFFFFF);
}

function assertCompactLength(target: any, key: string) {
    return assertUInt16(target, key);
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
    };
}
