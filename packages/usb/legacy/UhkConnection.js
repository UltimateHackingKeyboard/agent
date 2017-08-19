var usb = require('usb');
var R = require('ramda');
var s = require('underscore.string');

var UhkConnection = function(selectedLogLevel) {
    'use strict';
    var self = this;

    // Public methods

    self.sendRequest = function(command, arg, callback, shouldReceiveResponse) {
        if (shouldReceiveResponse === undefined) {
            shouldReceiveResponse = true;
        }

        var request;
        if (arg === null) {
            request = new Buffer([command]);
        } else if (typeof arg === 'number') {
            request = new Buffer([command, arg]);
        } else if (typeof arg === 'string') {
            var charCodes = arg.split('').map(function(char) {return char.charCodeAt(0)});
            request = new Buffer([command].concat(charCodes));
        } else {
            throw new Error('UhkConnection.sendRequest(): arg is of unknown type');
        }

        log(UhkConnection.LOG_LEVELS.TRANSFER, 'Sending request', request);
        setReport(request, function() {
            if (shouldReceiveResponse) {
                receiveResponse(UhkConnection.LOG_LEVELS.IGNORED_TRANSFER, function() {
                    // The first response is cached by the OS so let's ignore it and go for the second one.
                    receiveResponse(UhkConnection.LOG_LEVELS.TRANSFER, callback);
                });
            } else {
                callback();
            }
        });
    };

    // Private methods

    function setReport(message, callback) {
        device.controlTransfer(
            0x21,     // bmRequestType (constant for this control request)
            0x09,     // bmRequest (constant for this control request)
            0,        // wValue (MSB is report type, LSB is report number)
            0,        // wIndex (interface number)
            message,  // message to be sent
            callback
        );
    }

    function receiveResponse(logLevel, callback) {
        var endpoint = usbInterface.endpoints[0];
        var readLength = 64;
        endpoint.transfer(readLength, function(error, data) {
            if (error) {
                log(logLevel, 'Error response received', error);
            } else {
                log(logLevel, 'Received response:', data);
            }
            callback(error, data)
        });
    }

    function setConfiguration(callback) {
        device.controlTransfer(                 // Send a Set Configuration control request
            0,                                  // bmRequestType
            0x09,                               // bmRequest
            0,                                  // wValue (Configuration value)
            UhkConnection.GENERIC_HID_INTERFACE_ID,                                  // wIndex
            new Buffer(0),                      // message to be sent
            callback                            // callback to be executed upon finishing the transfer
        );
    }

    function log(logLevel, message) {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        if (logLevel & selectedLogLevel) {
            console.log.apply(this, args);
        }
    }

    // Initialize

    var device;
    var usbInterface;

    self.connect = function(errorCallback) {
        pollUntil(function() {
            var foundDevices = findDevices();
            if (foundDevices.length > 0) {
                var foundDevice = foundDevices[0];
                console.log('UHK connected in %s mode.',
                            foundDevice.enumerationMode.id);

                device = foundDevice.device;
                try {
                    device.open();  // TODO: What if multiple keyboards are plugged in?
                } catch (error) {
                    if (error.errno === -3) {
                        console.log('Unable to open USB device of VID %s and PID %s. Please fix permissions!',
                                    s.pad(UhkConnection.VENDOR_ID.toString(16), 4, '0'),
                                    s.pad(foundDevice.enumerationMode.productId.toString(16), 4, '0'));
                        process.exit(1);
                    } else {
                        throw error;
                    }
                }

                usbInterface = self.usbInterface = device.interface(0);
                if (usbInterface.isKernelDriverActive()) {
                    usbInterface.detachKernelDriver();
                }

                process.on('exit', attachKernelDriver);
                process.on('SIGINT', attachKernelDriver);
                process.on('uncaughtException', attachKernelDriver);

                usbInterface.claim();
                setConfiguration(errorCallback);
                return true;
            }

            return false;
        },
        function() {
            errorCallback('Could not connect to the UHK. Is it connected to the host?');
        });
    };

    self.waitUntilDisconnect = function(errorCallback, successCallback) {
        pollUntil(function() {
            if (findDevices().length === 0) {
                successCallback();
                usbInterface = undefined;
                return true;
            }

            return false;
        },
        function() {
            errorCallback('Could not disconnect the UHK');
        });
    };

    function findDevices() {
        return UhkConnection.ENUMERATION_MODES.map(function(enumerationMode) {
            return {
                enumerationMode: enumerationMode,
                device: usb.findByIds(UhkConnection.VENDOR_ID, enumerationMode.productId)
            }
        }).filter(R.prop('device'));
    }

    function pollUntil(pollCallback, errorCallback) {
        var retryTimeout = 5000;  // ms
        var retryInterval = 200;  // ms

        function keepPolling() {
            if (pollCallback()) {
                return;
            }

            if (retryTimeout <= 0) {
                return errorCallback();
            }

            retryTimeout -= retryInterval;
            setTimeout(keepPolling, retryInterval);
        }

        keepPolling();
    }

    function attachKernelDriver() {
        if (usbInterface) {
            usbInterface.release();
            if (!usbInterface.isKernelDriverActive()) {
                usbInterface.attachKernelDriver();
            }
            usbInterface = undefined;
        }
    }
};

UhkConnection.VENDOR_ID = 0x16d2;  // TODO: Restore to 0x16d0 for the final prototype.
UhkConnection.GENERIC_HID_INTERFACE_ID = 2;

UhkConnection.LOG_LEVELS = {
    TRANSFER:         0x01,
    IGNORED_TRANSFER: 0x02,
    ALL:              0xff
};

UhkConnection.COMMANDS = {
    DETECT: -1,
    REENUMERATE:  0,
    READ_EEPROM:  67,
    WRITE_EEPROM: 1
};

UhkConnection.ENUMERATION_MODES = [
    {id:'KEYBOARD_6KRO',    enumerationId:0, productId:0x05ea},
    {id:'KEYBOARD_NKRO',    enumerationId:3, productId:0x05eb},  // TODO: Implement this mode in firmware.
    {id:'BOOTLOADER_RIGHT', enumerationId:1, productId:0x05ec},  // CDC bootloader
    {id:'BOOTLOADER_LEFT',  enumerationId:2, productId:0x05ed}   // USB to serial
];

module.exports = UhkConnection;
