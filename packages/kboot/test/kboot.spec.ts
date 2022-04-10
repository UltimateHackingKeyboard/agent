import { BootloaderVersion, CommandResponse, Commands, KBoot, Peripheral, Properties, ResponseCodes, ResponseTags } from '../src/index.js';
import { TestPeripheral } from './test-peripheral.js';

describe('kboot', () => {
    let kboot: KBoot;
    let testPeripheral: Peripheral;

    beforeEach(() => {
        testPeripheral = new TestPeripheral();
        kboot = new KBoot(testPeripheral);
    });

    describe('getBootloaderVersion', () => {
        it('should works', async () => {
            const sendCommandResponse: CommandResponse = {
                code: ResponseCodes.Success,
                tag: ResponseTags.Property,
                // tslint:disable-next-line:max-line-length
                raw: Buffer.from([0x03, 0x00, 0x0c, 0x00, 0xa7, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x4b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
            };
            spyOn(testPeripheral, 'sendCommand').and.returnValue(Promise.resolve(sendCommandResponse));
            const version = await kboot.getBootloaderVersion();
            const expectedVersion: BootloaderVersion = {
                protocolName: 'K',
                major: 2,
                minor: 0,
                bugfix: 0
            };
            expect(version).toEqual(expectedVersion);
            expect(testPeripheral.sendCommand).toHaveBeenCalledWith({
                command: Commands.GetProperty,
                params: [1, 0, 0, 0, 0, 0, 0, 0]
            });
        });
    });
});
