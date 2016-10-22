exports = module.exports = {
    bufferToString: function(buffer) {
        var str = '';
        for (var i = 0; i < buffer.length; i++) {
            var hex = buffer[i].toString(16) + ' ';
            if (hex.length <= 2) {
                hex = '0' + hex;
            }
            str += hex;
        };
        return str;
    }
}
