import { UserConfiguration } from '../../config-serializer/config-items/UserConfiguration';

export class Local {

    constructor(private dataModelVersion: number) { }

    getConfig(): UserConfiguration {
        let configJsonString = localStorage.getItem('config');
        let config: UserConfiguration;

        if (configJsonString) {
            const configJsonObject = JSON.parse(configJsonString);
            if (configJsonObject.dataModelVersion === this.dataModelVersion) {
                config = new UserConfiguration().fromJsonObject(configJsonObject);
            }
        }

        return config;
    }

    saveConfig(config: UserConfiguration): void {
        localStorage.setItem('config', JSON.stringify(config.toJsonObject()));
    }
}
