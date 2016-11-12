## Installation

1. Install node.js and npm
2. Run `npm install` in this directory
3. Run script eg. `node blink-test-led.js`

## Driver requirements

### Linux
Default driver.

### Windows
Inorder to make the usb lib work, the WinUsb driver should be installed (only) for interface 0, the rest should be the default HidUsb. 

1. Download [zadig](http://zadig.akeo.ie/)
2. Install WinUsb for Ultimate Hacking Keyboard (Interface 0)

For more information click [here](https://www.npmjs.com/package/usb).