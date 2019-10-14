# Changelog

All notable changes to this project will be documented in this file.

The format is loosely based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

Every Agent version includes the most recent firmware version. See the [firmware changelog](https://github.com/UltimateHackingKeyboard/firmware/blob/master/CHANGELOG.md).

## [1.2.15] - 2019-10-14

Firmware: 8.6.0 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.6.0)] | Device Protocol: 4.4.0 | User Config: 4.0.1 | Hardware Config: 1.0.0

- Fix Linux SUID issue by using the --no-sandbox Electron option.
- Fix keyboard description z-index issue.
- Fix macro keystroke modifier capture.
- Fix 1px select2 UI glitch in the key action popover.
- Gray out the current keymap in keymap tab dropdown list.
- Only animate the halves when they get merged or split.

## [1.2.14] - 2019-10-04

Firmware: 8.6.0 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.6.0)] | Device Protocol: 4.4.0 | User Config: 4.0.1 | Hardware Config: 1.0.0

- Use native kboot firmware update on Linux and Mac. Use blhost on Windows.
- Allow .tar.bz2 firmware file selection on Mac.
- Fix macro reordering.

## [1.2.13] - 2019-09-13

Firmware: 8.**6.0** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.6.0)] | Device Protocol: 4.4.0 | User Config: 4.0.1 | Hardware Config: 1.0.0

- Fix device recovery mode.
- Correctly display whether the UHK is detected.
- Animate keyboard splitting, merging, and the presence of the left half.
- Show all the 8 mouse buttons if firmware <=8.6.0 is used.
- Don't disable input in the key action popover after adding a layer switch action, deleting it, and trying to edit it on its layer.
- Provide reasonable default mouse settings for Macs.
- Show per macro usage count when Alt is held.
- Don't change tab immediately upon closing the key action popover.
- Fix UI glitch that occurrs when hitting Tab after updating keymap description.
- Make the Agent icon slightly smaller to be consistent with most application icons.
- Redesign the About page.
- Link the UHK knowledgebase from the help page.
- Make the middle mouse button not open new windows on links in Agent.
- Add top auto-update notification bar.
- Save window state when closing Agent.
- Hide USB usage data in console.

## [1.2.12] - 2018-11-14

Firmware: 8.**5.3** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.5.3)] | Device Protocol: 4.4.0 | User Config: 4.0.1 | Hardware Config: 1.0.0

- When the firmware of the right keyboard half is larger or equal than 8.4.3 then display the "Lock layer when double tapping this key" checkbox and remove "... macro playback is not implemented yet..." notices.
- Upgrade to node-hid 0.7.3 which utilizes the hidraw USB driver on Linux instead of libusb.
- Update udev rules for the new hidraw based node-hid.
- Improve the "Cannot find your UHK" and the privilege escalation screens to show more relevant messages when transitioning from the libusb based node-hid to the hidraw based node-hid.
- Fix the rendering of macro actions, so that their text doesn't overlap.
- Add "International {1,2,3}" and "Language {1,2}" keypress actions.
- Add icon for the Play/Pause keypress action.
- Remove the Stop/Eject keypress action.
- Make the "Type text" macro action accept clipboard data on Mac.
- Display "You can't change this mapping because on the base layer a layer switcher key targets this key." in the key action popover whenever it applies.
- Fix UI bug which could be triggered by tapping Tab in the keymap abbreviation input.
- Don't trigger Agent shortcuts when capturing keypresses.
- Log USB device list before checking permissions.
- Show OS-specific modifiers in the title bar of macro actions.
- Only show the device list on Linux when the list actually changes.

## [1.2.11] - 2018-10-03

Firmware: 8.2.5 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.2.5)] | Device Protocol: 4.4.0 | User Config: 4.0.1 | Hardware Config: 1.0.0

- Add backspace and caps lock icons which avoids the overlap of their old texts.
- Fix right and middle mouse click macro actions which were exchanged.
- Include Agent version to the firmware update log.

## [1.2.10] - 2018-09-24

Firmware: 8.2.5 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.2.5)] | Device Protocol: 4.4.0 | User Config: 4.0.1 | Hardware Config: 1.0.0

- Add History Back and History Forward scancodes.
- Save the actual decelerated scroll speed instead of using the accelerated scroll speed by accident.
- Allow layer switcher secondary roles only on the base layer.
- When remapping modifiers, display a warning suggesting to remap them on all layers.
- Display more exact instructions on the permission setup screen.
- Set the decelerated scroll speed of the default configuration from 20 to 10.
- Map Caps Lock without Ctrl on default keymaps.
- Rename "Scroll Lock" to "ScrLk" and "Num Lock" to "NumLk" on keys to avoid text overlap.
- In the scancode select2, display "Print Screen SysRq" and add SysRq above PrtScn when rendering the key.
- Fix left and right direction titles for mouse movement macro actions.

## [1.2.9] - 2018-09-13

Firmware: 8.2.5 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.2.5)] | Device Protocol: 4.4.0 | User Config: 4.0.1 | Hardware Config: 1.0.0

- Display OS-specific modifiers.
- Display secondary roles.
- Don't trigger "Remap on all layers" after leaving Agent with Alt+Tab.

## [1.2.8] - 2018-08-26

Firmware: 8.**2.5** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.2.5)] | Device Protocol: 4.4.0 | User Config: 4.0.1 | Hardware Config: 1.0.0

- Uncheck the "Remap on all keymaps" and "Remap on all layers" checkboxes of the key action popover by default.
- Bind left and right Shift on the Mouse layer of all keymaps in the default configuration.
- Make ng2-select2 widgets faster.
- Add note to the LED brightness page saying that current UHK versions are not backlit.
- Fix the padding of the secondary role tooltip.
- Remove the redundant scrollbar from the LED brightness page.

## [1.2.7] - 2018-07-26

Firmware: 8.4.0 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.4.0)] | Device Protocol: 4.4.0 | User Config: 4.0.1 | Hardware Config: 1.0.0

- Fix Agent startup exception on Linux by upgrading Electron builder.
- Change the shortcut which enables the USB stack test code, so that it can be triggered with the default Mac US keymap.

## [1.2.6] - 2018-07-26

Firmware: 8.**4.0** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.4.0)] | Device Protocol: 4.**4.0** | User Config: 4.0.1 | Hardware Config: 1.0.0

- Replace the Linux blhost binary with a statically compiled version that doesn't use special instructions and shouldn't segfault.
- Keep the current layer when changing keymaps.
- Fix the sleep key of Mac keymaps.
- Add help page.
- Add "save to keyboard" and "remap key" shortcuts.
- Build only AppImages for Linux.
- Replace ng2-select2 widgets with ngx-select-ex that always shows up in the correct position.
- Improve the phrasing of the firmware update error message.
- Tweak unsupported Windows firmware update notification.
- Hide the Settings menu until auto update is implemented.
- Don't scroll when the macro tab of the key action popover gets selected.
- Add keyboard shortcut for enabling the USB stack test mode of the firmware. `DEVICEPROTOCOL:MINOR`
- Tone down the color of the separator line.

## [1.2.5] - 2018-06-26

Firmware: 8.2.5 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.2.5)] | Device Protocol: 4.3.1 | User Config: 4.0.1 | Hardware Config: 1.0.0

- When remapping a switch keymap action on all keymaps, don't set it on its own keymap.
- Make the key action popover always contain the action of the current key, even after cancelled.
- Include the firmware version to be updated to the firmware update log.
- Update the Agent icon of the side menu and the about page.
- When remapping a key, only flash the affected key instead of all keys.
- Fade in/out the keyboard separator line only when splitting the keyboard.
- Only show the unsupported OS message of the firmware page on relevant Windows versions.
- Close and reopen USB device when an error occurs.
- Temporarily remove the export keymap feature because it's useless until import is implemented.

## [1.2.4] - 2018-06-21

Firmware: 8.2.5 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.2.5)] | Device Protocol: 4.3.1 | User Config: 4.0.1 | Hardware Config: 1.0.0

- Replace Linux x86-64 blhost with a statically linked version which should make firmware updates work on every Linux distro.

## [1.2.3] - 2018-06-19

Firmware: 8.2.5 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.2.5)] | Device Protocol: 4.3.1 | User Config: 4.0.1 | Hardware Config: 1.0.0

- Add checkboxes for remapping keys on all layers and/or all keymaps.
- Add separator line between the keyboard halves.
- Add double tap icon for switch layer actions.
- Improve the looks and content of the tooltips of the key action popover.
- Make the left keyboard half less likely to timeout during firmware update.
- Terminate the firmware update process if blhost segfaults.
- Replace the Linux x86-64 version of the blhost binary which should not make it segfault anymore.
- Make the firmware update log shorter by listing one device per line and not repeating the list of available USB devices.
- Make the firmware update help text shorter.

## [1.2.2] - 2018-05-27

Firmware: 8.2.**5** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.2.5)] | Device Protocol: 4.3.**1** | User Config: 4.0.1 | Hardware Config: 1.0.0

- Offer recovery for bricked right keyboard halfs.
- Detect when the hardware configuration of a device is invalid and display a notification. `DEVICEPROTOCOL:PATCH`
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
