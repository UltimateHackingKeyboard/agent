/// <reference path="UhkBuffer.ts" />

interface Serializable<T> {
    fromJsObject(jsObject: any): T;
    fromBinary(buffer: UhkBuffer): T;
    toJsObject(): any;
    toBinary(buffer: UhkBuffer);
}
