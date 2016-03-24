class UhkBuffer {
    buffer: Buffer;
    offset: number;

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

    readString(string:string):void {
        // to be implemented
    }

    writeString(string:string):void {
        this.buffer.write(string, this.offset, string.length, 'ascii');
        this.offset += string.length;
        this.writeUInt8(0);
    }
}
