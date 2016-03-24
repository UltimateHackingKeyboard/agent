class UhkBuffer {
    buffer: Buffer;
    offset: number;

    constructor(buffer) {
        this.offset = 0;
        this.buffer = buffer;
    }

    int8(value) {
        this.buffer.writeInt8(value, this.offset);
        this.offset += 1;
    }

    uint8(value) {
        this.buffer.writeUInt8(value, this.offset);
        this.offset += 1;
    }

    int16(value) {
        this.buffer.writeInt16LE(value, this.offset);
        this.offset += 2;
    }

    uint16(value) {
        this.buffer.writeUInt16LE(value, this.offset);
        this.offset += 2;
    }

    int32(value) {
        this.buffer.writeInt32LE(value, this.offset);
        this.offset += 4;
    }

    uint32(value) {
        this.buffer.writeUInt32LE(value, this.offset);
        this.offset += 4;
    }

    string(string) {
        this.buffer.write(string, this.offset, string.length, 'ascii');
        this.offset += string.length;
        this.uint8(0);
    }
}
