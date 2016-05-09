import {Serializable} from '../Serializable';
import {ModuleConfigurations} from './ModuleConfigurations';
import {KeyMaps} from './KeyMaps';
import {Macros} from './Macros';
import {UhkBuffer} from '../UhkBuffer';
import {assertUInt8, assertUInt32} from '../assert';

export class UhkConfiguration extends Serializable<UhkConfiguration> {

    signature: string;

    @assertUInt8
    dataModelVersion: number;

    @assertUInt32
    prologue: number;

    @assertUInt8
    hardwareId: number;

    @assertUInt8
    brandId: number;

    moduleConfigurations: ModuleConfigurations;

    keyMaps: KeyMaps;

    macros: Macros;

    @assertUInt32
    epilogue: number;

    _fromJsObject(jsObject: any): UhkConfiguration {
        this.signature = jsObject.signature;
        this.dataModelVersion = jsObject.dataModelVersion;
        this.prologue = jsObject.prologue;
        this.hardwareId = jsObject.hardwareId;
        this.brandId = jsObject.brandId;
        this.moduleConfigurations = new ModuleConfigurations().fromJsObject(jsObject.moduleConfigurations);
        this.keyMaps = new KeyMaps().fromJsObject(jsObject.keyMaps);
        this.macros = new Macros().fromJsObject(jsObject.macros);
        this.epilogue = jsObject.epilogue;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): UhkConfiguration {
        this.signature = buffer.readString();
        this.dataModelVersion = buffer.readUInt8();
        this.prologue = buffer.readUInt32();
        this.hardwareId = buffer.readUInt8();
        this.brandId = buffer.readUInt8();
        this.moduleConfigurations = new ModuleConfigurations().fromBinary(buffer);
        this.keyMaps = new KeyMaps().fromBinary(buffer);
        this.macros = new Macros().fromBinary(buffer);
        this.epilogue = buffer.readUInt32();
        return this;
    }

    _toJsObject(): any {
        return {
            signature: this.signature,
            dataModelVersion: this.dataModelVersion,
            prologue: this.prologue,
            hardwareId: this.hardwareId,
            brandId: this.brandId,
            moduleConfigurations: this.moduleConfigurations.toJsObject(),
            keyMaps: this.keyMaps.toJsObject(),
            macros: this.macros.toJsObject(),
            epilogue: this.epilogue
        };
    }

    _toBinary(buffer: UhkBuffer): void {
        buffer.writeString(this.signature);
        buffer.writeUInt8(this.dataModelVersion);
        buffer.writeUInt32(this.prologue);
        buffer.writeUInt8(this.hardwareId);
        buffer.writeUInt8(this.brandId);
        this.moduleConfigurations.toBinary(buffer);
        this.keyMaps.toBinary(buffer);
        this.macros.toBinary(buffer);
        buffer.writeUInt32(this.epilogue);
    }

    toString(): string {
        return `<UhkConfiguration signature="${this.signature}">`;
    }
}
