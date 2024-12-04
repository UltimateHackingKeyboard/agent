import { assertEnum } from '../assert.js';
import { UhkBuffer } from '../uhk-buffer.js';
import { SerialisationInfo } from './serialisation-info.js';

export enum HostConnections {
    Empty = 0,
    UsbRight = 1,
    UsbLeft = 2,
    BLE = 3,
    Dongle = 4,
}

export const HOST_CONNECTION_LABELS: Readonly<Record<HostConnections, string>> = Object.freeze({
    [HostConnections.Empty]: 'Empty',
    [HostConnections.UsbRight]: 'USB Right',
    [HostConnections.UsbLeft]: 'USB Left',
    [HostConnections.BLE]: 'BLE',
    [HostConnections.Dongle]: 'Dongle',
});

export const HOST_CONNECTION_COUNT_MAX = 22;
export const BLE_ADDRESS_LENGTH = 6;
const BLE_ADDRESS_SEPARATOR = ':';

export function convertBleAddressArrayToString(address: number[]): string {
    return address.map(x => x.toString(16)).join(BLE_ADDRESS_SEPARATOR);
}

export function convertBleStringToNumberArray(address: string): number[] {
    const split = address.split(BLE_ADDRESS_SEPARATOR);
    const result: number[] = [];

    for(let i = 0; i < BLE_ADDRESS_LENGTH; i++) {
        const segment = Number.parseInt(split[i], 16) || 0;
        result.push(segment);
    }

    return result;
}

export class HostConnection {
    @assertEnum(HostConnections) type: HostConnections;

    address: string;
    name: string;
    switchover: boolean;

    constructor(other?: HostConnection) {
        this.switchover = false;

        if (other) {
            this.type = other.type;
            this.address = other.address;
            this.name = other.name;
            this.switchover = other.switchover;
        }
    }

    fromJsonObject(jsonObject: any, serialisationInfo: SerialisationInfo): HostConnection {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 8:
                return this.fromJsonObjectV8(jsonObject, serialisationInfo);

            default:
                throw new Error(`HostConnection configuration does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }
    }

    fromBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): HostConnection {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 8:
                return this.fromJsonBinaryV8(buffer, serialisationInfo);

            default:
                throw new Error(`HostConnection configuration does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }
    }

    toJsonObject(): any {
        const json: any = {
            type: HostConnections[this.type],
        };

        if(this.hasAddress()) {
            json.address = this.address;
        }

        if (this.type !== HostConnections.Empty) {
            json.switchover = this.switchover;
            json.name = this.name;
        }

        return json;
    }

    toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt8(this.type);

        if (this.hasAddress()) {
            const address = this.address.split(BLE_ADDRESS_SEPARATOR);

            for(let i = 0; i < BLE_ADDRESS_LENGTH; i++) {
                const segment = Number.parseInt(address[i], 16) || 0;
                buffer.writeUInt8(segment);
            }
        }

        if (this.type !== HostConnections.Empty) {
            buffer.writeBoolean(this.switchover);
            buffer.writeString(this.name);
        }
    }

    public hasAddress(): boolean {
        return this.type === HostConnections.BLE || this.type === HostConnections.Dongle;
    }

    private fromJsonBinaryV8(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): HostConnection {
        this.type = buffer.readUInt8();

        if (this.hasAddress()) {
            const address = [];

            for(let i = 0; i < BLE_ADDRESS_LENGTH; i++) {
                address.push(buffer.readUInt8());
            }

            this.address = convertBleAddressArrayToString(address);
        }

        if (this.type !== HostConnections.Empty) {
            this.switchover = false;
            if (serialisationInfo.userConfigMinorVersion >= 3) {
                this.switchover = buffer.readBoolean();
            }

            this.name = buffer.readString();
        }

        return this;
    }

    private fromJsonObjectV8(jsonObject: any, serialisationInfo: SerialisationInfo): HostConnection {
        this.type = HostConnections[<string>jsonObject.type];
        if (this.hasAddress()) {
            this.address = jsonObject.address;
        }

        if (this.type === HostConnections.Empty) {
            this.name = '';
            this.switchover = false;
        }
        else {
            this.name = jsonObject.name;
            this.switchover = jsonObject.switchover ?? false;
        }

        return this;
    }
}

export function emptyHostConnection(): HostConnection {
    const hostConnection = new HostConnection();
    hostConnection.type = HostConnections.Empty;
    hostConnection.name = '';

    return hostConnection;
}

export function defaultHostConnections(): HostConnection[] {
    const usbHostConnection = new HostConnection();
    usbHostConnection.type = HostConnections.UsbRight;
    usbHostConnection.name = 'My PC';

    const hostConnections: HostConnection[] = [
        usbHostConnection
    ];

    for (let i = hostConnections.length; i < HOST_CONNECTION_COUNT_MAX; i++) {
        hostConnections.push(emptyHostConnection());
    }

    return hostConnections;
}
