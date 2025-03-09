import { assertEnum, assertUInt8 } from '../../assert.js';
import { UhkBuffer } from '../../uhk-buffer.js';
import { SerialisationInfo } from '../serialisation-info.js';
import { KeyActionId } from './key-action.js';
import { keyActionType } from './key-action.js';
import { KeyAction } from './key-action.js';

export enum ConnectionCommands {
    last = 0,
    next = 1,
    previous = 2,
    switchByHostConnectionId = 3,
}

export class ConnectionsAction extends KeyAction {

    @assertEnum(ConnectionCommands) command: ConnectionCommands;
    @assertUInt8 hostConnectionId: number;

    constructor(other?: ConnectionsAction) {
        super(other);

        if (!other) {
            return;
        }

        this.command = other.command;
        this.hostConnectionId = other.hostConnectionId;
    }

    fromJsonObject(jsonObject: any, serialisationInfo: SerialisationInfo): ConnectionsAction {
        this.assertKeyActionType(jsonObject);
        this.command = ConnectionCommands[<string>jsonObject.command]
        if (this.hasHostConnectionId()) {
            this.hostConnectionId = jsonObject.hostConnectionId;
        }
        else {
            this.hostConnectionId = 0;
        }

        this.rgbColorFromJson(jsonObject, serialisationInfo);

        return this;
    }

    fromBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): ConnectionsAction {
        this.readAndAssertKeyActionId(buffer);
        this.command = buffer.readUInt8();
        if (this.hasHostConnectionId()) {
            this.hostConnectionId = buffer.readUInt8();
        }
        else {
            this.hostConnectionId = 0;
        }
        this.rgbColorFromBinary(buffer, serialisationInfo);

        return this;
    }

    toJsonObject(serialisationInfo: SerialisationInfo) {
        return {
            keyActionType: keyActionType.ConnectionsAction,
            command: ConnectionCommands[this.command],
            hostConnectionId: this.hasHostConnectionId()
                ? this.hostConnectionId
                : undefined,
            ...this.rgbColorToJson(serialisationInfo)
        };
    }

    toBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): void {
        buffer.writeUInt8(KeyActionId.ConnectionsAction);
        buffer.writeUInt8(this.command)
        if (this.hasHostConnectionId()) {
            buffer.writeUInt8(this.hostConnectionId)
        }
        this.rgbColorToBinary(buffer, serialisationInfo);
    }

    getName(): string {
        return 'ConnectionsAction';
    }

    toString(): string {
        return `<ConnectionsAction command="${this.command}" hostConnectionId="${this.hostConnectionId}">`;
    }

    hasHostConnectionId(): boolean {
        return this.command === ConnectionCommands.switchByHostConnectionId
    }
}
