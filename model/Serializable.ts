/// <reference path="UhkBuffer.ts" />

interface Serializable {
    fromJsObject(jsObject: any);
    fromBinary(buffer: UhkBuffer);
    toJsObject(): any;
    toBinary(buffer: UhkBuffer);
}
