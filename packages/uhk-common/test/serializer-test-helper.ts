import { SerialisationInfo } from '../src/config-serializer/config-items/serialisation-info.js';
import { UhkBuffer } from '../src/config-serializer/uhk-buffer.js';

export function jsonDefaultHelper(baseObject: any, serialisationInfo: SerialisationInfo, serializationParam?: any, deserializationParam?: any): void {
    const json = baseObject.toJsonObject(serialisationInfo, serializationParam);
    const newObject = new baseObject.constructor;
    newObject.fromJsonObject(json, serialisationInfo, deserializationParam);
    console.log(newObject);
    console.log(baseObject);
    expect(newObject).toEqual(baseObject);
}

export function binaryDefaultHelper(baseObject: any, serialisationInfo: SerialisationInfo, serializerParam?: any, deserializationParam?: any): void {
    const buffer = new UhkBuffer();
    baseObject.toBinary(buffer, serialisationInfo, serializerParam);
    buffer.offset = 0;
    const newObject = new baseObject.constructor;
    newObject.fromBinary(buffer, serialisationInfo, deserializationParam);

    expect(newObject).toEqual(baseObject);
}
