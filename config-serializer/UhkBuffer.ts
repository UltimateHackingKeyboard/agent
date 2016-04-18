class UhkBuffer {

    private static eepromSize = 32 * 1024;
    private static maxCompactLength = 0xFFFF;
    private static longCompactLengthPrefix = 0xFF;
    private static stringEncoding = 'utf8';
    private static isFirstElementToDump = false;

    offset: number;
    private _enableDump = false;

    private buffer: Buffer;
    private bytesToBacktrack: number;

    constructor() {
        this.offset = 0;
        this.bytesToBacktrack = 0;
        this.buffer = new Buffer(UhkBuffer.eepromSize);
        this.buffer.fill(0);
    }

    readInt8(): number {
        let value = this.buffer.readInt8(this.offset);
        this.dump(`i8(${value})`);
        this.bytesToBacktrack = 1;
        this.offset += this.bytesToBacktrack;
        return value;
    }

    writeInt8(value: number): void {
        this.dump(`i8(${value})`);
        this.buffer.writeInt8(value, this.offset);
        this.offset += 1;
    }

    readUInt8(): number {
        let value = this.buffer.readUInt8(this.offset);
        this.dump(`u8(${value})`);
        this.bytesToBacktrack = 1;
        this.offset += this.bytesToBacktrack;
        return value;
    }

    writeUInt8(value: number): void {
        this.dump(`u8(${value})`);
        this.buffer.writeUInt8(value, this.offset);
        this.offset += 1;
    }

    readInt16(): number {
        let value = this.buffer.readInt16LE(this.offset);
        this.dump(`i16(${value})`);
        this.bytesToBacktrack = 2;
        this.offset += this.bytesToBacktrack;
        return value;
    }

    writeInt16(value: number): void {
        this.dump(`i16(${value})`);
        this.buffer.writeInt16LE(value, this.offset);
        this.offset += 2;
    }

    readUInt16(): number {
        let value = this.buffer.readUInt16LE(this.offset);
        this.dump(`u16(${value})`);
        this.bytesToBacktrack = 2;
        this.offset += this.bytesToBacktrack;
        return value;
    }

    writeUInt16(value: number): void {
        this.dump(`u16(${value})`);
        this.buffer.writeUInt16LE(value, this.offset);
        this.offset += 2;
    }

    readInt32(): number {
        let value = this.buffer.readInt32LE(this.offset);
        this.dump(`i32(${value})`);
        this.bytesToBacktrack = 4;
        this.offset += this.bytesToBacktrack;
        return value;
    }

    writeInt32(value: number): void {
        this.dump(`i32(${value})`);
        this.buffer.writeInt32LE(value, this.offset);
        this.offset += 4;
    }

    readUInt32(): number {
        let value = this.buffer.readUInt32LE(this.offset);
        this.dump(`u32(${value})`);
        this.bytesToBacktrack = 4;
        this.offset += this.bytesToBacktrack;
        return value;
    }

    writeUInt32(value: number): void {
        this.dump(`u32(${value})`);
        this.buffer.writeUInt32LE(value, this.offset);
        this.offset += 4;
    }

    readCompactLength(): number {
        let length = this.readUInt8();
        if (length === UhkBuffer.longCompactLengthPrefix) {
            length += this.readUInt8() << 8;
        }
        return length;
    }

    writeCompactLength(length: number) {
        if (length >= UhkBuffer.longCompactLengthPrefix) {
            this.writeUInt8(UhkBuffer.longCompactLengthPrefix);
            this.writeUInt16(length);
        } else {
            this.writeUInt8(length);
        }
    }

    readString(): string {
        let stringByteLength = this.readCompactLength();
        let str = this.buffer.toString(UhkBuffer.stringEncoding, this.offset, this.offset + stringByteLength);
        this.dump(`${UhkBuffer.stringEncoding}(${str})`);
        this.bytesToBacktrack = stringByteLength;
        this.offset += stringByteLength;
        return str;
    }

    writeString(str: string): void {
        let stringByteLength = Buffer.byteLength(str, UhkBuffer.stringEncoding);

        if (stringByteLength > UhkBuffer.maxCompactLength) {
            throw 'Cannot serialize string: ${stringByteLength} bytes is larger ' +
                  'than the maximum allowed length of ${UhkBuffer.maxStringByteLength} bytes';
        }

        this.writeCompactLength(stringByteLength);
        this.dump(`${UhkBuffer.stringEncoding}(${str})`);
        this.buffer.write(str, this.offset, stringByteLength, UhkBuffer.stringEncoding);
        this.offset += stringByteLength;
    }

    backtrack(): void {
        this.offset -= this.bytesToBacktrack;
        this.bytesToBacktrack = 0;
    }

    getBufferContent(): Buffer {
        return this.buffer.slice(0, this.offset);
    }

    get enableDump() {
        return this._enableDump;
    }

    set enableDump(value) {
        if (value) {
            UhkBuffer.isFirstElementToDump = true;
        }
        this._enableDump = value;
    }

    dump(value) {
        if (!this.enableDump) {
            return;
        }

        if (!UhkBuffer.isFirstElementToDump) {
            process.stdout.write(', ');
        }

        process.stdout.write(value);

        if (UhkBuffer.isFirstElementToDump) {
            UhkBuffer.isFirstElementToDump = false;
        }
    }
}
