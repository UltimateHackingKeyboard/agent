var usb = require('usb');

exports = module.exports = {
    getUsbEndpoints: function() {
        var vid = 0x16d3;
        var pid = 0x05ea;

        var device = usb.findByIds(vid, pid);
        device.open();

        var usbInterface = device.interface(0);

        // https://github.com/tessel/node-usb/issues/147
        // The function 'isKernelDriverActive' is not available on Windows and not even needed.
        if (process.platform !== 'win32' && usbInterface.isKernelDriverActive()) {
            usbInterface.detachKernelDriver();
        }
        usbInterface.claim();

        var endpointIn = usbInterface.endpoints[0];
        var endpointOut = usbInterface.endpoints[1];
        return [endpointIn, endpointOut];
    },

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
