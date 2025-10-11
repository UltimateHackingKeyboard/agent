#!/bin/bash

declare -a uhk_devices=(
    "37a8:0001"
    "37a8:0003"
    "37a8:0005"
    "37a8:0007"
    "37a8:0009"
)

USB_DRIVER_PATH="/sys/bus/usb/drivers/usb"

for dev in /sys/bus/usb/devices/*; do
    if [[ -f "$dev/idVendor" && -f "$dev/idProduct" ]]; then
        VID=$(cat "$dev/idVendor")
        PID=$(cat "$dev/idProduct")
        MATCH="${VID}:${PID}"

        for target in "${uhk_devices[@]}"; do
            if [[ "$MATCH" == "$target" ]]; then
                DEVNAME=$(basename "$dev")

                if [[ -e "$USB_DRIVER_PATH/unbind" ]]; then
                    echo "$DEVNAME" | sudo tee "$USB_DRIVER_PATH/unbind"
                    sleep 1.5
                    echo "$DEVNAME" | sudo tee "$USB_DRIVER_PATH/bind"
                    echo "Rebound device: $dev"
                fi
            fi
        done
    fi
done
