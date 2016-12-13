import { UhkConfiguration } from '../../config-serializer/config-items/UhkConfiguration';

export class Local {

    constructor(private dataModelVersion: number) { }

    getConfig(): UhkConfiguration {
        let configJsonString = localStorage.getItem('config');
        let config: UhkConfiguration;

        if (configJsonString) {
            const configJsonObject = JSON.parse(configJsonString);
            if (configJsonObject.dataModelVersion === this.dataModelVersion) {
                config = new UhkConfiguration().fromJsObject(configJsonObject);
            }
        }

        return config;
    }

    saveConfig(config: UhkConfiguration): void {
        localStorage.setItem('config', JSON.stringify(config.toJsObject()));
    }
}
