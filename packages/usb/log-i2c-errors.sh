#!/usr/bin/env bash

(
startTime=`date +%s`
while true; do
    s="$((`date +%s`-$startTime))"
    echo "$((s/60))m"
    for i in `seq 0 5`; do ./get-slave-i2c-errors.ts $i; done
done
) 2>&1 | tee $1
