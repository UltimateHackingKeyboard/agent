import { UhkBuffer } from '../src/config-serializer';

export function jsonDefaultHelper(baseObject: any): void {
    const json = baseObject.toJsonObject();
    const newObject = new baseObject.constructor;
    newObject.fromJsonObject(json);

    expect(newObject).toEqual(baseObject);
}

export function binaryDefaultHelper(baseObject: any): void {
    const buffer = new UhkBuffer();
    baseObject.toBinary(buffer);
    buffer.offset = 0;
    const newObject = new baseObject.constructor;
    newObject.fromBinary(buffer);

    expect(newObject).toEqual(baseObject);
}
