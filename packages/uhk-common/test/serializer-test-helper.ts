import { UhkBuffer } from '../src/config-serializer/uhk-buffer';

export function jsonDefaultHelper(objectType: any): void {
    const baseObject = new objectType();
    const json = baseObject.toJsonObject();
    const newObject = new objectType();
    newObject.fromJsonObject(json);

    expect(newObject).toEqual(baseObject);
}

export function binaryDefaultHelper(objectType: any): void {
    const baseObject = new objectType();
    const buffer = new UhkBuffer();
    baseObject.toBinary(buffer);
    const newObject = new objectType();
    newObject.fromBinary(buffer);

    expect(newObject).toEqual(baseObject);
}
