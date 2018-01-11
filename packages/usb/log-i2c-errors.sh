#!/usr/bin/env bash

(
startTime=`date +%s`
while true; do
    s="$((`date +%s`-$startTime))"
    echo "$((s/60/60)):$((s/60)):$((s))"
    for i in `seq 0 5`; do ./get-slave-i2c-errors.js $i; done
done
) 2>&1 | tee $1
