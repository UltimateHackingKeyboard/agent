class KeyActions implements Serializable<KeyActions> {

    keyActions: Serializable<KeyAction>[];

    fromJsObject(jsObjects: any): KeyActions {
        for (let jsObject of jsObjects) {
            this.keyActions.push(KeyActionFactory.fromJsObject(jsObject));
        }
        return this;
    }

    fromBinary(buffer: UhkBuffer): KeyActions {
        let arrayLength = buffer.readCompactLength();
        for (let i = 0; i < arrayLength; i++) {
            this.keyActions.push(KeyActionFactory.fromBinary(buffer));
        }
        return this;
    }

    toJsObject(): any {
        let array = [];
        for (let keyAction of this.keyActions) {
            keyAction.toJsObject();
        }
        return array;
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeCompactLength(this.keyActions.length);
        for (let keyAction of this.keyActions) {
            keyAction.toBinary(buffer);
        }
    }
}
