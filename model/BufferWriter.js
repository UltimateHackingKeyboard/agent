var BufferWriter = function(bufferParam) {
    var offset = 0;
    self = {};
    var buffer = bufferParam;

    self.int8 = function(value) {
        buffer.writeInt8(value, offset);
        offset += 1;
    };

    self.uint8 = function(value) {
        buffer.writeUInt8(value, offset);
        offset += 1;
    };

    self.int16 = function(value) {
        buffer.writeInt16LE(value, offset);
        offset += 2;
    };

    self.uint16 = function(value) {
        buffer.writeUInt16LE(value, offset);
        offset += 2;
    };

    self.int32 = function(value) {
        buffer.writeInt32LE(value, offset);
        offset += 4;
    };

    self.uint32 = function(value) {
        buffer.writeUInt32LE(value, offset);
        offset += 4;
    };

    self.string = function(string) {
        buffer.write(string, offset, string.length, 'ascii');
        offset += string.length;
        self.uint8(0);
    };

    return self;
};

module.exports = BufferWriter;
