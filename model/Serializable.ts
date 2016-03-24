/// <reference path="UhkBuffer.ts" />

interface Serializable {
    fromJsObject(jsObject: any);
    toJsObject(): any;
    fromBinary(buffer: UhkBuffer);
    toBinary(buffer: UhkBuffer);
}
