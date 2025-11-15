#!/bin/bash
# Manual installer for systems without package manager support
# Usage: sudo ./manual-install.sh install|uninstall

set -euo pipefail

SCRIPT_SRC="usr/local/bin/uhk-usb-rebind.sh"
UNIT_SRC="usr/lib/systemd/system/uhk-usb-rebind.service"

SCRIPT_DST="/usr/local/bin/uhk-usb-rebind.sh"
UNIT_DST="/usr/local/lib/systemd/system/uhk-usb-rebind.service"

usage() {
    echo "Usage: $0 install|uninstall"
    exit 2
}

if [[ $(id -u) -ne 0 ]]; then
    echo "This script must be run as root (sudo)"
    exit 1
fi

if [[ $# -ne 1 ]]; then
    usage
fi

action="$1"

case "$action" in
    install)
        echo "Installing UHK USB rebind script and systemd unit to /usr/local..."
        mkdir -p "$(dirname "$SCRIPT_DST")" "$(dirname "$UNIT_DST")"
        cp -a "$SCRIPT_SRC" "$SCRIPT_DST"
        chmod 755 "$SCRIPT_DST"
        cp -a "$UNIT_SRC" "$UNIT_DST"
        chmod 644 "$UNIT_DST"
        if command -v systemctl >/dev/null 2>&1; then
            systemctl daemon-reload || true
            systemctl enable --now uhk-usb-rebind.service || true
            echo "Service enabled and started (if systemd present)."
        else
            echo "systemctl not found; unit installed at $UNIT_DST. Enable it manually if desired."
        fi
        echo "Install complete."
        ;;
    uninstall)
        echo "Uninstalling UHK USB rebind script and systemd unit from /usr/local..."
        if command -v systemctl >/dev/null 2>&1; then
            systemctl stop uhk-usb-rebind.service || true
            systemctl disable uhk-usb-rebind.service || true
            systemctl daemon-reload || true
        fi
        rm -f "$SCRIPT_DST" || true
        rm -f "$UNIT_DST" || true
        echo "Uninstall complete."
        ;;
    *)
        usage
        ;;
esac

exit 0
