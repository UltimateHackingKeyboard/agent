# Changelog

All notable changes to this project will be documented in this file.

The format is loosely based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

Every Agent version includes the most recent firmware version. See the [firmware changelog](https://github.com/UltimateHackingKeyboard/firmware/blob/master/CHANGELOG.md).

## [1.2.2] - 2018-05-27

Firmware: 8.2.**5** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.2.5)] | Device Protocol: 4.3.**1** | User Config: 4.0.**1** | Hardware Config: 1.0.0

- Offer recovery for bricked right keyboard halfs.
- Detect when the hardware configuration of a device is invalid and display a notification.
- Check if the keyboard is in factory reset mode and if so, display a relevant instruction.
- Only allow ASCII characters in type text macro actions.
- Allow uploading the same file multiple times in a row.
- Only send auto update notification when the user initiates the update.
- Update the firmware versions on the firmware update page right after firmware updates.
- Add a lot of useful instructions to the firmware page to help users update the firmware.
- Add the operating system and initial device list to the firmware update log.
- Add copy to clipboard button to the top right corner of the firmware update terminal widget.

## [1.2.1] - 2018-05-12

Firmware: 8.2.**2** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.2.2)] | Device Protocol: 4.3.0 | User Config: 4.0.**1** | Hardware Config: 1.0.0

- Match for the new USB usage page and usage number. This is critical for UHKs flashed with firmware >=8.2.2 to be recognized by Agent on OSX.
- Make the config serializer handle long media macro actions. `USERCONFIG:PATCH`
- Add note on the macro page explaining that the macro engine of the firmware is not ready yet.
- Add an example to the scancode tooltip to better explain users how to invoke non-US characters.

## [1.2.0] - 2018-04-20

Firmware: 8.**2.0** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.2.0)] | Device Protocol: 4.**3.0** | User Config: 4.0.0 | Hardware Config: 1.0.0

- Tweak the default mouse speed. This was necessary because the last firmware version adjusted speed multipliers. The mouse speed can be reset via the "Reset speeds to default" button of the "Mouse speed" page.
- Make the newly added switch-keymap.js script utilize the new UsbCommandId_SwitchKeymap, allowing for programmatic keymap switching. `DEVICEPROTOCOL:MINOR`

## [1.1.5] - 2018-04-10

Firmware: 8.1.5 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.1.5)] | Device Protocol: 4.2.0 | User Config: 4.0.0 | Hardware Config: 1.0.0

- Don't allow to run multiple instances of Agent at the same time, but rather focus the already existing Agent window.

## [1.1.4] - 2018-04-09

Firmware: 8.1.5 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.1.5)] | Device Protocol: 4.2.0 | User Config: 4.0.0 | Hardware Config: 1.0.0

- Handle privilege escalation gracefully on Linux even without PolicyKit.
- Fix application icon path.
- Replace application icon with a diagonal gradient based icon that should look better on desktop.
- Make saving the configuration more robust, and add a configuration recovery screen.
- Reposition the ISO key in the scancode list.

## [1.1.3] - 2018-04-06

Firmware: 8.1.**5** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.1.5)] | Device Protocol: 4.2.0 | User Config: 4.0.0 | Hardware Config: 1.0.0

- Show the firmware versions of the left and right keyboard halves on the firmware page.
- Fix menu scancode.
- Make the tooltip text regarding non-US characters easier to understand.
- On the Device Configuration page change terminology from download/upload to export/import for greater clarity.

## [1.1.2] - 2018-03-09

Firmware: 8.1.**4** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.1.4)] | Device Protocol: 4.2.0 | User Config: 4.0.0 | Hardware Config: 1.0.0

- Fix the configuration serializer so that the correct key actions get serialized, and the save button always appears when needed.
- Add instructions to the firmware page to aid users.
- Fix code signing on OSX.
- Sign Agent on Windows.

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

Firmware: 8.**1**.0 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.1.0)] | Device Protocol: 4.**2.0** | User Config: 4.0.0 | Hardware Config: 1.0.0

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
