#!/bin/sh
set -e # fail on the first error
set -x # show expanded variables

userConfigSize=`./get-config-size.js`
hardwareConfigSize=`./get-config-size.js h`

iter=1
while true; do
    echo iter $iter

    dd if=/dev/urandom of=hardware-config.write bs=1 count=$hardwareConfigSize
    ./write-config.js h
    ./eeprom.js writeHardwareConfig
    ./eeprom.js readHardwareConfig
    ./read-config.js h
    diff hardware-config.read hardware-config.write

    dd if=/dev/urandom of=user-config.write bs=1 count=$userConfigSize
    ./write-config.js
    ./eeprom.js writeUserConfig
    ./eeprom.js readUserConfig
    ./read-config.js
    diff user-config.read user-config.write

    iter=$((iter+1))
done
