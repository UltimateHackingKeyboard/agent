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

    private _mouseAction: MouseActionParam;

    get mouseAction(): number {
        return this._mouseAction;
    }

    set mouseAction(mouseAction) {
        if (!MouseAction.isMouseActionValid(mouseAction)) {
            throw `Invalid MouseAction.mouseAction: ${mouseAction}`;
        }
        this._mouseAction = mouseAction;
    }

    static isMouseActionValid(keyActionParam): boolean {
        return MouseActionParam[keyActionParam] !== undefined;
    }

    fromJsObject(jsObject: any): MouseAction {
        this.assertKeyActionType(jsObject, MouseAction.keyActionTypeString, 'MouseAction');
        this.mouseAction = jsObject.mouseAction;
        return this;
    }

    fromBinary(buffer: UhkBuffer): MouseAction {
        this.readAndAssertKeyActionId(buffer, KeyActionId.MouseAction, 'MouseAction');

        this.mouseAction = buffer.readUInt8();
        if (!MouseAction.isMouseActionValid(this.mouseAction)) {
            throw `Invalid MouseAction.param: ${this.mouseAction}`;
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
        buffer.writeUInt8(KeyActionId.MouseAction);
        buffer.writeUInt8(this.mouseAction);
    }
}
