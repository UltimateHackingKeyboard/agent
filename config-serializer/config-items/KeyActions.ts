class KeyActions extends UhkArray<KeyActions> {

    keyActions: Serializable<KeyAction>[] = [];

    _fromJsObject(jsObjects: any): KeyActions {
        for (let jsObject of jsObjects) {
            this.keyActions.push(KeyActionFactory.fromJsObject(jsObject));
        }
        return this;
    }

    _fromBinary(buffer: UhkBuffer): KeyActions {
        let arrayLength = buffer.readCompactLength();
        for (let i = 0; i < arrayLength; i++) {
            this.keyActions.push(KeyActionFactory.fromBinary(buffer));
        }
        return this;
    }

    _toJsObject(): any {
        let array = [];
        for (let keyAction of this.keyActions) {
            array.push(keyAction.toJsObject());
        }
        return array;
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeCompactLength(this.keyActions.length);
        for (let keyAction of this.keyActions) {
            keyAction.toBinary(buffer);
        }
    }

    toString(): string {
        return `<KeyActions length="${this.keyActions.length}">`;
    }
}
