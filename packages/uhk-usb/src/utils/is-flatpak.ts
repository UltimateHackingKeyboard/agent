import { existsSync } from 'node:fs';

/**
 * Return true when Agent runs inside a Flatpak sandbox.
 *
 * Flatpak exports FLATPAK_ID into the sandboxed process and creates /.flatpak-info.
 * A few Linux code paths behave differently inside the sandbox: the udev rules can
 * not be inspected or installed from within it, and application updates are
 * delivered by Flathub instead of the built-in updater.
 */
export function isFlatpak(): boolean {
    if (process.platform !== 'linux') {
        return false;
    }

    return !!process.env.FLATPAK_ID || existsSync('/.flatpak-info');
}
