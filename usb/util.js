let usb = require('usb');

exports = module.exports = {
    getUsbEndpoints: () => {
        let vid = 0x16d3;
        let pid = 0x05ea;

        let device = usb.findByIds(vid, pid);
        device.open();

        let usbInterface = device.interface(0);

        // https://github.com/tessel/node-usb/issues/147
        // The function 'isKernelDriverActive' is not available on Windows and not even needed.
        if (process.platform !== 'win32' && usbInterface.isKernelDriverActive()) {
            usbInterface.detachKernelDriver();
        }
        usbInterface.claim();

        let endpointIn = usbInterface.endpoints[0];
        let endpointOut = usbInterface.endpoints[1];
        return [endpointIn, endpointOut];
    },

    bufferToString: buffer => {
        let str = '';
        for (let i = 0; i < buffer.length; i++) {
            let hex = buffer[i].toString(16) + ' ';
            if (hex.length <= 2) {
                hex = '0' + hex;
            }
            str += hex;
        };
        return str;
    }
}
