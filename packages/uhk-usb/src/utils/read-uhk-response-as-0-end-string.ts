import { UhkBuffer } from 'uhk-common';

export default function readUhkResponseAs0EndString(buffer: UhkBuffer): string {
    buffer.readUInt8();

    return buffer.read0EndString();
}
