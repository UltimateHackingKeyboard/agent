# Changelog

All notable changes to this project will be documented in this file.

The format is loosely based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

## [1.0.4] - 2017-12-30

Firmware: [8.0.0](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/8.0.0) | Device Protocol: 4.0.0 | User Config: 4.0.0 | Hardware Config: 1.0.0

- Add mouse speed settings.

## [1.0.3] - 2017-12-28

Firmware: [8.0.**0**](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/8.0.**0**) | Device Protocol: 4.0.0 | User Config: 4.0.0 | Hardware Config: 1.0.0

- Add LED brightness settings.
- Some key actions, for example Left Arrow were displayed as text with modifiers and as icon without modifires. Now, they're always displayed as icons.
- Clean up firmware update console messages a bit.
- Remove the add keymap button because this feature is not only useless but confusing until it gets reimplemented.
- Explicitly mention on the macro tab of the key action popover that macro playback is not implemented yet.
- Downgrade to firmware 8.0.0 because the left I2C watchdog of firmware 8.0.1 is not proven yet.

## [1.0.2] - 2017-12-25

Firmware: [**8.0.1**](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/8.0.1) | Device Protocol: 4.0.0 | User Config: 4.0.0 | Hardware Config: 1.0.0

- Fix firmware upgrade on Linux.

## [1.0.1] - 2017-12-22

Firmware: [7.0.0](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/7.0.0) | Device Protocol: 4.0.0 | User Config: 4.0.0 | Hardware Config: 1.0.0

- Fix Linux privilege escalation when udev rules aren't set up.

## [1.0.0] - 2017-12-14

Firmware: [**7**.0.0](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/7.0.0) | Device Protocol: 4.0.0 | User Config: 4.0.0 | Hardware Config: 1.0.0

- First release
