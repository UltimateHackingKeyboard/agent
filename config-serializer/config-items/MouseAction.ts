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

class MouseAction extends KeyAction {
    private _mouseAction: MouseActionParam;

    get mouseAction(): MouseActionParam {
        return this._mouseAction;
    }

    set mouseAction(mouseAction) {
//        if (!this.isMouseActionValid(mouseAction)) {
//            throw `Invalid MouseAction.mouseAction: ${mouseAction}`;
//        }
        this._mouseAction = mouseAction;
    }

//    isMouseActionValid(keyActionParam): boolean {
//        return MouseActionParam[<string>keyActionParam] !== undefined;
//    }

    _fromJsObject(jsObject: any): MouseAction {
        this.assertKeyActionType(jsObject, KeyActionType.MouseAction, 'MouseAction');
        this.mouseAction = MouseActionParam[<string>jsObject.mouseAction];
        return this;
    }

    _fromBinary(buffer: UhkBuffer): MouseAction {
        this.readAndAssertKeyActionId(buffer, KeyActionId.MouseAction, 'MouseAction');

        this.mouseAction = buffer.readUInt8();
  //      if (!this.isMouseActionValid(this.mouseAction)) {
  //          throw `Invalid MouseAction.param: ${this.mouseAction}`;
  //      }

        return this;
    }

    _toJsObject(): any {
        return {
            keyActionType: KeyActionType.MouseAction,
            mouseAction: MouseActionParam[this.mouseAction]
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.MouseAction);
        buffer.writeUInt8(this.mouseAction);
    }

    toString(): string {
        return `<MouseAction mouseAction="${this.mouseAction}">`;
    }
}
