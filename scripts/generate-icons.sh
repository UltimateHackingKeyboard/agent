#!/bin/sh

# apt-get install inkscape imagemagick-6.q16 icnsutils

agentIconSvg=../packages/uhk-web/src/svgs/icons/agent-icon.svg

for size in 16 24 32 48 64 96 128 256 512 1024; do
    inkscape -z --export-png=../build/icons/${size}x${size}.png -w $size $agentIconSvg
done

convert ../build/icons/256x256.png ../build/icon.ico

cd ../build/icons
png2icns ../icon.icns 16x16.png 32x32.png 48x48.png 128x128.png 256x256.png 512x512.png
