import { UhkBuffer } from '../src/config-serializer';

export function jsonDefaultHelper(baseObject: any, serializationParam?: any, deserializationParam?: any): void {
    const json = baseObject.toJsonObject(serializationParam);
    const newObject = new baseObject.constructor();
    newObject.fromJsonObject(json, deserializationParam);

    expect(newObject).toEqual(baseObject);
}

export function binaryDefaultHelper(baseObject: any, serializerParam?: any, deserializationParam?: any): void {
    const buffer = new UhkBuffer();
    baseObject.toBinary(buffer, serializerParam);
    buffer.offset = 0;
    const newObject = new baseObject.constructor();
    newObject.fromBinary(buffer, deserializationParam);

    expect(newObject).toEqual(baseObject);
}
