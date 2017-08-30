#!/bin/sh
set -e # fail the script if a command fails

./jump-to-bootloader.sh
blhost --usb 0x15a2,0x0073 flash-security-disable 0403020108070605
blhost --usb 0x15a2,0x0073 flash-erase-region 0xc000 475136
blhost --usb 0x15a2,0x0073 flash-image uhk-right.srec
blhost --usb 0x15a2,0x0073 reset
