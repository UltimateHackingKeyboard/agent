#!/bin/sh
set -e # fail on the first error
set -x # show expanded variables

userConfigSize=`./get-config-size.ts`
hardwareConfigSize=`./get-config-size.ts h`

iter=1
while true; do
    echo iter $iter

    dd if=/dev/urandom of=hardware-config.write bs=1 count=$hardwareConfigSize
    ./write-config.ts h
    ./eeprom.ts writeHardwareConfig
    ./eeprom.ts readHardwareConfig
    ./read-config.ts h
    diff hardware-config.read hardware-config.write

    dd if=/dev/urandom of=user-config.write bs=1 count=$userConfigSize
    ./write-config.ts
    ./eeprom.ts writeUserConfig
    ./eeprom.ts readUserConfig
    ./read-config.ts
    diff user-config.read user-config.write

    iter=$((iter+1))
done
