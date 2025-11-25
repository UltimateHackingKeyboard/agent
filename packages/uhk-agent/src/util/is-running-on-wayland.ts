import process from "node:process";

export function isRunningOnWayland(): boolean {
    return !!(process.env.WAYLAND_DISPLAY ||
        process.env.XDG_SESSION_TYPE === 'wayland' ||
        process.env.GDK_BACKEND === 'wayland');
}
