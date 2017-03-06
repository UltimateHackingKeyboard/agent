#!/usr/bin/env bash

cd $(dirname $0)
cp 50-uhk-write-access.rules /etc/udev/rules.d
udevadm trigger
udevadm settle
