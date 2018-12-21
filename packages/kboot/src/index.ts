import { devices, HID } from 'node-hid';
import { inspect } from 'util';

export * from './kboot';
export * from './enums';
export * from './models';
export * from './peripheral';
export * from './usb-peripheral';
export * from './util';

export const run = async (options: any): Promise<void> => {
    try {
        const response = await sendDataAsync(options);
        console.log('Response: %s', response);
    } catch (err) {
        console.error(err);
    }
};

export const sendDataAsync = (options: any): Promise<Buffer> => {
    return new Promise(async (resolve, reject) => {
        try {
            const devs = devices();
            console.log(devs);
            const device = devs.find(x => x.vendorId === options.vendorId && x.productId === options.productId);

            // const transferData = [1, 0, 0xA7 ];
            // const transferData = [0, ...new Array(35).fill(0)];
            const transferData = [1, 0, 0x0c, 0, 0x07, 0x00, 0x00, 0x02, 1, 0, 0, 0, 0, 0, 0, 0];
            // const transferData = [0, 0, 0x0c, 0x00, 0x07, 0x00, 0x00, 0x02, 0x00000001, 0x00000000];
            // const transferData = [0, 0x21, 0x09, 0x201, 0, 0x0c, 0x00, 0x07, 0x00, 0x00, 0x02, 0x00000001, 0x00000000];
            // ...new Array(23).fill(0) ];
            // const transferData = [0, 0x5A, 0xA4, 0x00, 0x33, 0x07, 0x00, 0x00, 0x02, 0x00000001, 0x00000000 ];

            const dev = new HID(device.path);
            // dev.on('data', data => {
            //     console.log('usb data:', inspect(data));
            // });
            // dev.on('error', data => {
            //     console.log('usb error:', data);
            // });

            dev.read((err: any, response: number[]) => {
                console.log({ err, response: inspect(response) });
                if (err) {
                    reject(err);
                }

                resolve(Buffer.from(response));
            });

            console.log('transfer data', transferData.toString());
            // dev.sendFeatureReport(transferData);
            dev.write(transferData);
            await snooze(100);
            // console.log('report0', dev.getFeatureReport(0, 64).toString());
            // console.log('report1', dev.getFeatureReport(1, 64).toString());
            // console.log('report2', dev.getFeatureReport(2, 64).toString());
            // console.log('report3', dev.getFeatureReport(3, 64).toString());
            // console.log('report4', dev.getFeatureReport(4, 64).toString());
            // for (let i = 0; i < 64; i++) {
            //         dev.write([1]);
            //         console.log(i);
            //         console.log('report0', dev.getFeatureReport(0, 32));
            //         console.log('report1', dev.getFeatureReport(1, 32));
            //         console.log('report2', dev.getFeatureReport(2, 32));
            //         console.log('report3', dev.getFeatureReport(3, 32));
            // }
            // dev.read((err, data) => console.log('before', { err, data }));
            // dev.read((err, data) => console.log('afters', { err, data }));
            // console.log('response', dev.readTimeout(1000));
            // console.log('write success');
        } catch (err) {
            console.error(err);
        }
    });
};

export const snooze = async (ms: number): Promise<any> => new Promise((resolve: Function) => setTimeout(resolve, ms));
