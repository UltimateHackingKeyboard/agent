function assertUInt8(target: any, key: string) {
    let val = this[key];
    if (delete this[key]) {
        Object.defineProperty(target, key, {
            get: function () {
                return val;
            },
            set: function (newVal) {
                if (newVal < 0 || newVal > 255) {
                    throw `Invalid ${target.constructor.name}.${key}: ${newVal} is not uint8`;
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
                        throw `Invalid ${target.constructor.name}.${key}: ${newVal} is not enum`;
                    }
                    val = newVal;
                },
                enumerable: true,
                configurable: true
            });
        }
    }
}
