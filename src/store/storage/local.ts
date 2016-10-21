import { UhkConfiguration } from '../../config-serializer/config-items/UhkConfiguration';

export class Local {

    constructor() { }

    getConfig(): UhkConfiguration {
        let configJson = localStorage.getItem('config');
        let config: UhkConfiguration;

        if (configJson) {
            config = new UhkConfiguration().fromJsObject(JSON.parse(configJson));
        }

        return config;
    }

    saveConfig(config: UhkConfiguration): void {
        localStorage.setItem('config', JSON.stringify(config.toJsObject()));
    }
}
