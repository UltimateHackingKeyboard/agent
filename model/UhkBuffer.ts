
class UhkBuffer {
    buffer: Buffer;
    offset: number;

    private static maxStringByteLength = 0xFFFF;
    private static longStringPrefix = 0xFF;
    private static stringEncoding = 'utf8';

    constructor(buffer:Buffer) {
        this.offset = 0;
        this.buffer = buffer;
    }

    readInt8():number {
        let value = this.buffer.readInt8(this.offset);
        this.offset += 1;
        return value;
    }

    writeInt8(value:number):void {
        this.buffer.writeInt8(value, this.offset);
        this.offset += 1;
    }

    readUInt8():number {
        let value = this.buffer.readUInt8(this.offset);
        this.offset += 1;
        return value;
    }

    writeUInt8(value:number):void {
        this.buffer.writeUInt8(value, this.offset);
        this.offset += 1;
    }

    readInt16():number {
        let value = this.buffer.readInt16LE(this.offset);
        this.offset += 2;
        return value;
    }

    writeInt16(value:number):void {
        this.buffer.writeInt16LE(value, this.offset);
        this.offset += 2;
    }

    readUInt16():number {
        let value = this.buffer.readUInt16LE(this.offset);
        this.offset += 2;
        return value;
    }

    writeUInt16(value:number):void {
        this.buffer.writeUInt16LE(value, this.offset);
        this.offset += 2;
    }

    readInt32():number {
        let value = this.buffer.readInt32LE(this.offset);
        this.offset += 4;
        return value;
    }

    writeInt32(value:number):void {
        this.buffer.writeInt32LE(value, this.offset);
        this.offset += 4;
    }

    readUInt32():number {
        let value = this.buffer.readUInt32LE(this.offset);
        this.offset += 4;
        return value;
    }

    writeUInt32(value:number):void {
        this.buffer.writeUInt32LE(value, this.offset);
        this.offset += 4;
    }

    readString():string {
        let stringByteLength = this.readUInt8();
        
        if (stringByteLength == UhkBuffer.longStringPrefix) {
            stringByteLength += this.readUInt8() << 8;
        }
        
        let string = this.buffer.toString(UhkBuffer.stringEncoding, this.offset, stringByteLength);
        this.offset += stringByteLength;
        return string;
    }

    writeString(string:string):void {
        let stringByteLength = Buffer.byteLength(string, UhkBuffer.stringEncoding);

        if (stringByteLength > UhkBuffer.maxStringByteLength) {
            throw 'Cannot serialize string: ${stringByteLength} bytes is larger ' +
                  'than the maximum allowed length of ${UhkBuffer.maxStringByteLength} bytes';
        }

        if (stringByteLength >= UhkBuffer.longStringPrefix) {
            this.writeUInt8(UhkBuffer.longStringPrefix);
            this.writeUInt16(stringByteLength);
        } else {
            this.writeUInt8(stringByteLength);
        }

        this.buffer.write(string, this.offset, stringByteLength, UhkBuffer.stringEncoding);
        this.offset += stringByteLength;
    }
}
