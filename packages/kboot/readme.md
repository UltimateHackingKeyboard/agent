# Javascript implementation of the Kinetis Bootloader protocol

Based on the [Kinetis Bootloader v2.0.0 Reference Manual](https://github.com/UltimateHackingKeyboard/bootloader/blob/master/doc/Kinetis%20Bootloader%20v2.0.0%20Reference%20Manual.pdf)

## Supported communication channels/protocols

-   [x] USB
-   [ ] I2C
-   [ ] SPI
-   [ ] CAN
-   [ ] UART

## Supported Commands

We implemented only the commands that is used in UHK software.
If someone needs other commands, (s)he can easily implement it based on existing.

-   [x] GetProperty
-   [ ] SetProperty
-   [ ] FlashEraseAll
-   [x] FlashEraseRegion
-   [x] FlashEraseAllUnsecure
-   [x] ReadMemory
-   [x] WriteMemory
-   [ ] FillMemory
-   [x] FlashSecurityDisable
-   [ ] Execute
-   [ ] Call
-   [x] Reset
-   [ ] FlashProgramOnce
-   [ ] FlashReadOnce
-   [ ] FlashReadResource
-   [ ] ConfigureQuadSpi
-   [ ] ReliableUpdate
-   [x] ConfigureI2c
-   [ ] ConfigureSpi
-   [ ] ConfigureCan

## How to use

```Typescript
  // Initialize peripheral
  const usbPeripheral = new UsbPeripheral({ productId: 1, vendorId: 1 });
  // Initialize Kboot
  const kboot = new KBoot(usbPeripheral);
  // Call the command
  const version = await kboot.getBootloaderVersion();
  // ... more commands

  // Close the communication channel. Release resources
  kboot.close();
```

If you have to communicate other I2C device over USB call `kboot.configureI2c(i2cId)` before the command.

```Typescript
  const usbPeripheral = new UsbPeripheral({ productId: 1, vendorId: 1 });
  const kboot = new KBoot(usbPeripheral);

  // Get the bootloader version of I2C device
  await kboot.configureI2c(i2cId);
  const version = await kboot.getBootloaderVersion();
```

## TODO

-   [ ] Improve exception handling
