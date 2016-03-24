class UhkBuffer {
    buffer: Buffer;
    offset: number;

    constructor(buffer) {
        this.offset = 0;
        this.buffer = buffer;
    }

    writeInt8(value) {
        this.buffer.writeInt8(value, this.offset);
        this.offset += 1;
    }

    writeUint8(value) {
        this.buffer.writeUInt8(value, this.offset);
        this.offset += 1;
    }

    writeInt16(value) {
        this.buffer.writeInt16LE(value, this.offset);
        this.offset += 2;
    }

    writeUint16(value) {
        this.buffer.writeUInt16LE(value, this.offset);
        this.offset += 2;
    }

    writeInt32(value) {
        this.buffer.writeInt32LE(value, this.offset);
        this.offset += 4;
    }

    writeUint32(value) {
        this.buffer.writeUInt32LE(value, this.offset);
        this.offset += 4;
    }

    writeString(string) {
        this.buffer.write(string, this.offset, string.length, 'ascii');
        this.offset += string.length;
        this.writeUint8(0);
    }
}
