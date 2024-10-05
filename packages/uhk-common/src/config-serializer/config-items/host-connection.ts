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
const BLE_ADDRESS_LENGTH = 6;
const ADDRESS_SEPARATOR = ':';

export class HostConnection {
    @assertEnum(HostConnections) type: HostConnections;

    address: string;
    name: string;

    constructor(other?: HostConnection) {
        if (other) {
            this.type = other.type;
            this.address = other.address;
            this.name = other.name;
        }
    }

    fromJsonObject(jsonObject: any, serialisationInfo: SerialisationInfo): HostConnection {
        this.type = HostConnections[<string>jsonObject.type];
        if (this.hasAddress()) {
            this.address = jsonObject.address;
        }

        if (this.type === HostConnections.Empty) {
            this.name = '';
        }
        else {
            this.name = jsonObject.name;
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): HostConnection {
        this.type = buffer.readUInt8();

        if (this.hasAddress()) {
            const address = [];

            for(let i = 0; i < BLE_ADDRESS_LENGTH; i++) {
                address.push(buffer.readUInt8());
            }

            this.address = address.map(x => x.toString(16)).join(ADDRESS_SEPARATOR);
        }

        if (this.type !== HostConnections.Empty) {
            this.name = buffer.readString();
        }

        return this;
    }

    toJsonObject(): any {
        const json: any = {
            type: HostConnections[this.type],
        };

        if(this.hasAddress()) {
            json.address = this.address;
        }

        if (this.type !== HostConnections.Empty) {
            json.name = this.name;
        }

        return json;
    }

    toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt8(this.type);

        if (this.hasAddress()) {
            const address = this.address.split(ADDRESS_SEPARATOR);

            for(let i = 0; i < BLE_ADDRESS_LENGTH; i++) {
                const segment = Number.parseInt(address[i], 16) || 0;
                buffer.writeUInt8(segment);
            }
        }

        if (this.type !== HostConnections.Empty) {
            buffer.writeString(this.name);
        }
    }

    private hasAddress(): boolean {
        return this.type === HostConnections.BLE || this.type === HostConnections.Dongle;
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
