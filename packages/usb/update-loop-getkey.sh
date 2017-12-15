#!/bin/bash

firmwarePath=$1

while true; do
    read -n 1 char
    if [[ $char == "a" ]]; then
        ./flash update-firmwares-and-configs.js "$firmwarePath" ansi
    elif [[ $char == "i" ]]; then
        ./flash update-firmwares-and-configs.js "$firmwarePath" iso
    fi
done
