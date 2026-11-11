# Flatpak packaging

Flatpak packaging for UHK Agent, intended for distribution via
[Flathub](https://flathub.org). The app ID is **`com.ultimategadgetlabs.agent`**, matching
the `appId` that `scripts/release.mjs` already uses for the macOS and Windows builds.

The manifest wraps the Linux AppImage published on
[GitHub Releases](https://github.com/UltimateHackingKeyboard/agent/releases): it downloads
it at build time, unpacks it with `--appimage-extract` (no FUSE needed) and runs it
against the Flathub Electron base app through
[zypak](https://github.com/refi64/zypak), which provides a working Chromium sandbox.

## Files

| File | Purpose |
| --- | --- |
| `com.ultimategadgetlabs.agent.yml` | flatpak-builder manifest (also the Flathub submission manifest) |
| `com.ultimategadgetlabs.agent.desktop` | Desktop entry |
| `com.ultimategadgetlabs.agent.metainfo.xml` | AppStream metadata |
| `com.ultimategadgetlabs.agent.png` | 512×512 icon (Flatpak rejects larger) |

## Building locally

Run from this directory — the manifest's `path:` sources are relative to it.

```
cd packaging/flatpak
flatpak install --user flathub org.freedesktop.Platform//25.08 org.freedesktop.Sdk//25.08 org.electronjs.Electron2.BaseApp//25.08
flatpak-builder --user --install --force-clean build-dir com.ultimategadgetlabs.agent.yml
flatpak run com.ultimategadgetlabs.agent
```

## Permissions

- `--device=all` — required for the keyboard to be reachable. Agent talks to `hidraw`
  nodes, and `--device=usb`/`--device=input` do not cover devices that are hot-plugged
  after the sandbox has been set up. The narrower permissions can be revisited if
  Flatpak grows hidraw support.
- `--filesystem=home` — the firmware upload and user configuration import/export flows use
  file dialogs. This may be reducible to the document portal after testing.

A host udev rule (`rules/50-uhk60.rules`) may still be required on distributions that do
not grant hidraw access to the logged-in user by default. Agent detects the missing rule
and shows the command to run on the host; it cannot install it from inside the sandbox.

## Updating the wrapped AppImage

Each Agent release produces a new AppImage. Flathub's
[external data checker](https://github.com/flathub/flathub/wiki/App-External-Data-Checker-Data)
(`x-checker-data: type: electron-updater`) reads the `latest-linux.yml` /
`latest-linux-arm64.yml` published alongside the release and opens a PR that bumps the
`url` and `sha512` automatically, so the manifest should not need manual updates.

To bump it by hand, replace the version in both `url`s and convert the new `sha512`
values from the corresponding `latest-linux*.yml` to hex:

```
curl -sSL https://github.com/UltimateHackingKeyboard/agent/releases/latest/download/latest-linux.yml
curl -sSL https://github.com/UltimateHackingKeyboard/agent/releases/latest/download/latest-linux-arm64.yml
```

The yml files publish the digest as base64; flatpak-builder expects hex. For example:

```
echo 'j0jeR2m+lLcAgNBhDH73S4L4HoMisGJIQtJOxz0JUQDyOpAeeBu81lfH0wGAJU8fqOr3uzxk4wxuceoN5deudw==' | base64 -d | xxd -p -c 256
```

Also add a `<release>` entry to `com.ultimategadgetlabs.agent.metainfo.xml`.

## Submitting to Flathub

The Flathub repository is separate from this one. Copy `com.ultimategadgetlabs.agent.*`
into a checkout of a `flathub/com.ultimategadgetlabs.agent` repository and open a PR
against [flathub/flathub](https://github.com/flathub/flathub) (see
[the submission docs](https://docs.flathub.org/docs/for-app-authors/submission)). The
maintainer who owns the `ultimategadgetlabs.com` domain must be involved, since Flathub
verifies domain ownership.

Before submitting:

- Add at least one more screenshot to the AppStream metadata (Flathub prefers two or
  more). Only the official UHK 80 screenshot from `uhk.io` is referenced today.
- Confirm the `LicenseRef-proprietary` licence is acceptable; the Agent licence is
  source-available and non-free, which Flathub permits but a reviewer may question.
