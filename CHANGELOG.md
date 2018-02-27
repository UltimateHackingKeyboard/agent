# Changelog

All notable changes to this project will be documented in this file.

The format is loosely based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

Every Agent version includes the most recent firmware version. See the [firmware changelog](https://github.com/UltimateHackingKeyboard/firmware/blob/master/CHANGELOG.md).

## [1.1.1] - 2018-02-13

Firmware: 8.1.**2** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.1.2)] | Device Protocol: 4.2.0 | User Config: 4.0.0 | Hardware Config: 1.0.0

- Sign Agent on OSX resulting in easier installation.
- Add per-keymap description field.
- Sort keymaps and macros alphabetically within the key action popover.
- Add tooltip regarding non-US scancodes.
- When deleting a macro, also delete the relevant play macro actions.
- Make the reset configuration button persist the reset configuration in Agent-web.
- Make Agent able to unbrick bricked modules.
- Assign "switch to test keymap" action on all keymaps in the default configuration.
- Add keymap descriptions in the default configuration.

## [1.1.0] - 2018-01-15

Firmware: 8.**1**.0 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.1.0)] | Device Protocol: 4.2.0 | User Config: 4.0.0 | Hardware Config: 1.0.0

- Only accept device, keymap, and macro names upon editing if their trimmed length is non-zero.
- Add diagnostics USB scripts, most notably /packages/usb/{get-i2c-health,set-i2c-baud-rate}.js, some utilizing new device protocol commands and properties. `DEVICEPROTOCOL:MINOR`
- Implement the Device -> Upload device configuration feature.
- Make update-module-firmware.js more robust and able to recover bricked modules (including the left half) by utilizing the newly added wait-for-kboot-idle.js. `DEVICEPROTOCOL:MINOR`
- Add the Agent -> About page containing the version number of Agent.
- On the mouse speed section of the key action popover, remove the now incorrect bottom sentence and slightly rephrase the top sentence.
- Remove --buspal speed specification argument because it gets disrespected by the firmware anyways.
- Fix get-left-firmware-version.js to display the correct firmware version.

## [1.0.4] - 2017-12-30

Firmware: 8.0.0 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.0.0)] | Device Protocol: 4.0.0 | User Config: 4.0.0 | Hardware Config: 1.0.0

- Add mouse speed settings.

## [1.0.3] - 2017-12-28

Firmware: 8.0.**0** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.0.0)] | Device Protocol: 4.0.0 | User Config: 4.0.0 | Hardware Config: 1.0.0

- Add LED brightness settings.
- Some key actions, for example Left Arrow were displayed as text with modifiers and as icon without modifires. Now, they're always displayed as icons.
- Clean up firmware update console messages a bit.
- Remove the add keymap button because this feature is not only useless but confusing until it gets reimplemented.
- Explicitly mention on the macro tab of the key action popover that macro playback is not implemented yet.
- Downgrade to firmware 8.0.0 because the left I2C watchdog of firmware 8.0.1 is not proven yet.

## [1.0.2] - 2017-12-25

Firmware: **8.0.1**[[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.0.1)] | Device Protocol: 4.0.0 | User Config: 4.0.0 | Hardware Config: 1.0.0

- Fix firmware upgrade on Linux.

## [1.0.1] - 2017-12-22

Firmware: 7.0.0[[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v7.0.0)] | Device Protocol: 4.0.0 | User Config: 4.0.0 | Hardware Config: 1.0.0

- Fix Linux privilege escalation when udev rules aren't set up.

## [1.0.0] - 2017-12-14

Firmware: **7**.0.0[[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v7.0.0)] | Device Protocol: 4.0.0 | User Config: 4.0.0 | Hardware Config: 1.0.0

- First release
