#!/bin/bash

while true; do
    startSeconds=`date +%s`
    ./wait-until-i2c-dies.js
    endSeconds=`date +%s`
    elapsedSeconds=$((startSeconds-endSeconds))
    echo $elapsedSeconds
    ./jump-to-bootloader.js > /dev/null
    sleep 6
done
