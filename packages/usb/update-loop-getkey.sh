#!/bin/bash

firmwarePath=$1

while true; do
    read -n 1 char
    if [[ $char == "a" ]]; then
        ./update-firmwares-and-configs.ts "$firmwarePath" ansi
    elif [[ $char == "i" ]]; then
        ./update-firmwares-and-configs.ts "$firmwarePath" iso
    fi
done
