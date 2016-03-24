class UhkBuffer {
    buffer: Buffer;
    offset: number;

    constructor(buffer:Buffer) {
        this.offset = 0;
        this.buffer = buffer;
    }

    writeInt8(value:number):void {
        this.buffer.writeInt8(value, this.offset);
        this.offset += 1;
    }

    writeUint8(value:number):void {
        this.buffer.writeUInt8(value, this.offset);
        this.offset += 1;
    }

    writeInt16(value:number):void {
        this.buffer.writeInt16LE(value, this.offset);
        this.offset += 2;
    }

    writeUint16(value:number):void {
        this.buffer.writeUInt16LE(value, this.offset);
        this.offset += 2;
    }

    writeInt32(value:number):void {
        this.buffer.writeInt32LE(value, this.offset);
        this.offset += 4;
    }

    writeUint32(value:number):void {
        this.buffer.writeUInt32LE(value, this.offset);
        this.offset += 4;
    }

    writeString(string:string):void {
        this.buffer.write(string, this.offset, string.length, 'ascii');
        this.offset += string.length;
        this.writeUint8(0);
    }
}
