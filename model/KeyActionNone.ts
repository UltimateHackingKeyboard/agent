/// <reference path="KeyAction.ts" />
/// <reference path="Serializable.ts" />

class KeyActionNone extends KeyAction implements Serializable<KeyActionNone> {
    static actionTypeString = 'none';
    static keyActionNoneId = 0;
    static keyActionNoneParam = 0;

    fromJsObject(jsObject: any): KeyActionNone {
        if (jsObject.actionType !== 'none') {
            throw 'KeyActionNone: The actionType is not "none"';
        }
        return this;
    }

    fromBinary(buffer: UhkBuffer): KeyActionNone {
        let keyActionId = buffer.readUInt8();
        if (keyActionId !== KeyActionNone.keyActionNoneId) {
            throw 'KeyActionNone: id is ${keyActionId} instead of ${KeyActionNone.keyActionNoneId}';
        }

        let keyActionParam = buffer.readUInt8();
        if (keyActionParam !== KeyActionNone.keyActionNoneParam) {
            throw 'KeyActionNone: The param is ${keyActionParam} instead of ${KeyActionNone.keyActionNoneParam}';
        }

        return this;
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
