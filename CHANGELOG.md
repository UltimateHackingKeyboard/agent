# Changelog

All notable changes to this project will be documented in this file.

The format is loosely based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

Every Agent version includes the most recent firmware version. See the [firmware changelog](https://github.com/UltimateHackingKeyboard/firmware/blob/master/CHANGELOG.md).

## [1.5.13] - 2020-05-03

Firmware: 8.10.9 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.10.9)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Fix firmware recovery mode.
- Fix bug that made Agent sometimes not detect the UHK upon startup.
- Error out during firmware update if connecting to a module takes longer than 30 seconds.
- Fix check marks next to the modules when force-updating the same firmware version.

## [1.5.12] - 2020-04-26

Firmware: 8.10.**9** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.10.9)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Make the firmware update process only update the needed keyboard halves and modules and show the current update step.

## [1.5.11] - 2020-03-31

Firmware: 8.10.**8** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.10.8)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Make the firmware updater update connected modules.
- Make key swapping work via drag-and-drop for non-rectangular keys.
- Update the default user configuration and factory configuration so that "double tap to lock" is only enabled for the Mouse key.
- When a macro is deleted, don't jump to the first macro, but to the next one.
- When a macro items is edited, don't jump to the end of the macro.

## [1.5.10] - 2020-03-11

Firmware: 8.10.**7** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.10.7)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Fix the keymap action section of the key action popover.
- Make touchpad action customizable.
- Disallow the use of multiple UHKs with Agent by showing a dedicated screen.

## [1.5.9] - 2020-02-22

Firmware: 8.10.**5** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.10.5)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Support the UHK 60 v2.
- Show connected modules.
- Make the side menu always visible.
- Fix keyboard description edit bug.
- Fix duplicate keymap and duplicate macro name bug.
- Make auto-upgrade work even on the first start of Agent.

## [1.5.8] - 2020-12-01

Firmware: 8.10.**2** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.10.2)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Fix collapsed side menu glitch.

## [1.5.7] - 2020-11-24

Firmware: 8.10.**2** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.10.2)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Fix occasional macro editor bugs and improve macro editor responsive layout.

## [1.5.6] - 2020-11-20

Firmware: 8.10.**2** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.10.2)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Add dark mode theme option under the settings menu.

## [1.5.5] - 2020-11-04

Firmware: 8.10.**2** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.10.2)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Don't force udev rule updates when not necessary. This change makes Agent not hang upon startup in sandboxed process environments like NixOS.

## [1.5.4] - 2020-08-29

Firmware: 8.10.1 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.10.1)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Fix the error message of the --reenumerate-and-exit command.

## [1.5.3] - 2020-08-28

Firmware: 8.10.1 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.10.1)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Make the --reenumerate-and-exit command more resilient.

## [1.5.2] - 2020-08-25

Firmware: 8.10.1 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.10.1)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Reduce overly large key labels so that they fit on keys.
- Add the --reenumerate-and-exit command line option.

## [1.5.1] - 2020-08-10

Firmware: 8.10.1 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.10.1)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Allow key swapping by drag and dropping the keys to be swapped.
- Display numpad keys explicitly by prefixing them with "Np ", and add relevant icons where applicable.
- Upon importing a configuration, don't save it automatically but merely load it into Agent. The save to keyboard button saves the imported configuration.
- Upon restoring a configuration from the configuration history, don't save it automatically but merely load it into Agent. The save to keyboard button saves the restored configuration.
- Lay out mouse pointer speed and mouse scroll speed sections in two columns.
- Lay out the buttons horizontally on the device configuration page.
- Slightly improve the about page loading state by using a spinner and improving phrasing.

## [1.5.0] - 2020-06-23

Firmware: 8.**10.1** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.10.1)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Fix auto updater.
- Allow $+-*/|\\<>?_'",\`@={} keymap abbreviation characters appearing on the LED display. Depends on firmware 8.10.0 `USERCONFIG:MINOR`
- Fix side menu star icon vertical alignment.
- Make the undo notification not covered by other elements.
- Add command line logging categories.
- Remove double version number from the Mac release filename.

## [1.4.5] - 2020-05-07

Firmware: 8.9.**3** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.9.3)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Use Font Awesome 5 icons instead of Font Awesome 4.
- Update Agent icon and favicon.
- Don't stuck at the loading screen when on-board user configuration is invalid and there is no previous configuration saved by Agent.

## [1.4.4] - 2020-04-20

Firmware: 8.**9.0** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.9.0)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Display error message on OSX when encountering with problematic USB hubs and docking stations.
- Make Agent faster by only rendering a single layer at a time instead of all layers per keymap.
- Use improved Agent icons on the loading screen and in the sidebar.
- Make reordering macro actions only possible by dragging them by their handle icons.
- Show OS-specific modifier names in the secondary role select2.
- Display "Win" instead of the "Windows" modifier everywhere.
- Center-align the explanation text in the key action popover under Mouse speed.
- Fix the favicon of the web build.

## [1.4.3] - 2020-03-01

Firmware: 8.8.1 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.8.1)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Make firmware updates on Linux much more stable.

## [1.4.2] - 2020-02-23

Firmware: 8.8.**1** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.8.1)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Add option to disable animations under the settings menu.
- Fix false "Your configuration occupies ${configSize} bytes, which is larger than the available 1 bytes ..." warning message.
- Make Agent properly start up when run by root on Linux.

## [1.4.1] - 2020-02-16

Firmware: 8.**8.0** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.8.0)] | Device Protocol: 4.7.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Revert to the previous udev rules which contain the uaccess method because it has actually better compatibility.
- Add the --preserve-udev-rules command line argument which can be used to not force udev rules update on problematic Linux distributions.
- Add the --help command line option which lists the available options and exits.
- Display macro shortcuts in LShift + LAlt + Tab format.

## [1.4.0] - 2020-02-04

Firmware: 8.7.0 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.7.0)] | Device Protocol: 4.**7.0** | User Config: 4.1.1 | Hardware Config: 1.0.0

- Add configuration history section to the configuration page.
- Change udev rules for better compatibility with some Linux distributions.
- Fix sporadic "User configuration size is 0" error which happened upon switching to the configuration page.
- Make get-device-state.js display toggled layer state. `DEVICEPROTOCOL:MINOR`

## [1.3.2] - 2020-01-20

Firmware: 8.7.**0** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.7.0)] | Device Protocol: 4.6.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Make udev rule update procedure reliable.
- Use the same udev rules as shown in the update instructions.
- Display out of space warning when relevant.
- Don't save too small window size.

## [1.3.1] - 2020-01-09

Firmware: 8.7.**1** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.7.1)] | Device Protocol: 4.6.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Fix Linux udev rule permissions, so that /dev/input event devices are not world readable/writable anymore. Agent checks the udev file, and overwrites the old one upon startup.
- Display the available on-board storage space on the device configuration page.
- Support tar.gz firmware files.
- Sanity-check firmware files before update.
- Provide more explicit firmware recovery message.

## [1.3.0] - 2019-12-08

Firmware: 8.**7.0** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.7.0)] | Device Protocol: 4.**6.0** | User Config: 4.1.1 | Hardware Config: 1.0.0

- Don't jump to the default keymap but stay on the current one upon merging or splitting the keyboard halves.
- Display an animated arrow pointing to the "Save to keyboard" button when showing it for the first time.
- Don't relist devices during firmware updates if the device list is unchanged.
- Make get-device-state.js display the actual layer. `DEVICEPROTOCOL:MINOR`

## [1.2.16] - 2019-11-05

Firmware: 8.6.0 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.6.0)] | Device Protocol: 4.4.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Add International 4 and International 5 scancodes.
- Fix digital signature issue on Mac OS 10.15 Catalina.
- Only display macro usage counts on hover.
- Add help tooltip for macro text actions.
- Improve the scancode tooltip of the key action popover.
- Improve the phrasing of firmware update messages and the firmware update error message.

## [1.2.15] - 2019-10-14

Firmware: 8.6.0 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.6.0)] | Device Protocol: 4.4.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Fix Linux SUID issue by using the --no-sandbox Electron option.
- Fix keyboard description z-index issue.
- Fix macro keystroke modifier capture.
- Fix 1px select2 UI glitch in the key action popover.
- Gray out the current keymap in keymap tab dropdown list.
- Only animate the halves when they get merged or split.

## [1.2.14] - 2019-10-04

Firmware: 8.6.0 [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.6.0)] | Device Protocol: 4.4.0 | User Config: 4.1.1 | Hardware Config: 1.0.0

- Use native kboot firmware update on Linux and Mac. Use blhost on Windows.
- Allow .tar.bz2 firmware file selection on Mac.
- Fix macro reordering.

## [1.2.13] - 2019-09-13

Firmware: 8.**6.0** [[release](https://github.com/UltimateHackingKeyboard/firmware/releases/tag/v8.6.0)] | Device Protocol: 4.4.0 | User Config: 4.**1.1** | Hardware Config: 1.0.0

- Fix device recovery mode.
- Correctly display whether the UHK is detected.
- Animate keyboard splitting, merging, and the presence of the left half.
- Show all the 8 mouse buttons if firmware <=8.6.0 is used. `USERCONFIG:MINOR`
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
