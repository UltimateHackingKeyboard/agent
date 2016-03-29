enum MouseActionParam {
    leftClick,
    middleClick,
    rightClick,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    scrollUp,
    scrollDown,
    scrollLeft,
    scrollRight,
    accelerate,
    decelerate
}

class MouseAction extends KeyAction implements Serializable<MouseAction> {
    static keyActionTypeString = 'mouse';
    static keyActionId = 244;

    _mouseAction: MouseActionParam;

    get mouseAction(): number {
        return this._mouseAction;
    }

    set mouseAction(mouseAction) {
        if (!MouseAction.isMouseActionValid(mouseAction)) {
            throw 'Invalid MouseAction.mouseAction: ${mouseAction}';
        }
        this._mouseAction = mouseAction;
    }

    static isMouseActionValid(keyActionParam): boolean {
        return MouseActionParam[keyActionParam] !== undefined;
    }

    fromJsObject(jsObject: any): MouseAction {
        this.mouseAction = jsObject.mouseAction;
        return this;
    }

    fromBinary(buffer: UhkBuffer): MouseAction {
        let keyActionId = buffer.readUInt8();
        if (keyActionId !== MouseAction.keyActionId) {
            throw 'Invalid MouseAction.id: ${keyActionId}';
        }

        let keyActionParam = buffer.readUInt8();
        if (!MouseAction.isMouseActionValid(keyActionParam)) {
            throw 'Invalid MouseAction.param: ${keyActionParam}';
        }

        return this;
    }

    toJsObject(): any {
        return {
            keyActionType: MouseAction.keyActionTypeString,
            mouseAction: MouseActionParam[this.mouseAction]
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MouseAction.keyActionId);
        buffer.writeUInt8(this.mouseAction);
    }
}
