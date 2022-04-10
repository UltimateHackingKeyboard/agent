import { UhkBuffer } from '../src/config-serializer/uhk-buffer.js';

export function jsonDefaultHelper(baseObject: any, serializationParam?: any, deserializationParam?: any, version = 4): void {
    const json = baseObject.toJsonObject(serializationParam);
    const newObject = new baseObject.constructor;
    newObject.fromJsonObject(json, deserializationParam || version, version);

    expect(newObject).toEqual(baseObject);
}

export function binaryDefaultHelper(baseObject: any, serializerParam?: any, deserializationParam?: any, version = 4): void {
    const buffer = new UhkBuffer();
    baseObject.toBinary(buffer, serializerParam);
    buffer.offset = 0;
    const newObject = new baseObject.constructor;
    newObject.fromBinary(buffer, deserializationParam || version, version);

    expect(newObject).toEqual(baseObject);
}
