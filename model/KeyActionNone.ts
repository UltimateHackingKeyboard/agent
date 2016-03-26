/// <reference path="KeyAction.ts" />
/// <reference path="Serializable.ts" />

class KeyActionNone extends KeyAction implements Serializable {
    static keyActionNoneId = 0;
    static keyActionNoneParam = 0;

    fromJsObject(jsObject: any) {
        if (jsObject.actionType !== 'none') {
            throw 'KeyActionNone: The actionType is not "none"';
        }
    }

    fromBinary(buffer: UhkBuffer) {
        let keyActionId = buffer.readUInt8();
        if (keyActionId !== KeyActionNone.keyActionNoneId) {
            throw 'KeyActionNone: id is ${keyActionId} instead of ${KeyActionNone.keyActionNoneId}';
        }

        let keyActionParam = buffer.readUInt8();
        if (keyActionParam !== KeyActionNone.keyActionNoneParam) {
            throw 'KeyActionNone: The param is ${keyActionParam} instead of ${KeyActionNone.keyActionNoneParam}';
        }
    }

    toJsObject(): any {
        return {
            actionType: 'none'
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionNone.keyActionNoneId);
        buffer.writeUInt8(KeyActionNone.keyActionNoneParam);
    }
}
