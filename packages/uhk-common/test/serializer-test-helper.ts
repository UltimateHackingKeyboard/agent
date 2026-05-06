import { TestContextAssert } from 'node:test';

import { SerialisationInfo } from '../src/config-serializer/config-items/serialisation-info.js';
import { UhkBuffer } from '../src/config-serializer/uhk-buffer.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsonDefaultHelper(assert: TestContextAssert, baseObject: any, serialisationInfo: SerialisationInfo, serializationParam?: any, deserializationParam?: any): void {
    const json = baseObject.toJsonObject(serialisationInfo, serializationParam);
    const newObject = new baseObject.constructor;
    newObject.fromJsonObject(json, serialisationInfo, deserializationParam);
    assert.deepStrictEqual(newObject, baseObject);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function binaryDefaultHelper(assert: TestContextAssert, baseObject: any, serialisationInfo: SerialisationInfo, serializerParam?: any, deserializationParam?: any): void {
    const buffer = new UhkBuffer();
    baseObject.toBinary(buffer, serialisationInfo, serializerParam);
    buffer.offset = 0;
    const newObject = new baseObject.constructor;
    newObject.fromBinary(buffer, serialisationInfo, deserializationParam);

    assert.deepStrictEqual(newObject, baseObject);
}
