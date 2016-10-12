import { UhkConfiguration } from '../../config-serializer/config-items/UhkConfiguration';
import { DataProviderService } from '../../services/data-provider.service';

export class Local {

    constructor(private dataProvider: DataProviderService) { }

    getConfig(): UhkConfiguration {
        let configJson = localStorage.getItem('config');
        let config: UhkConfiguration;
        if (configJson) {
            config = new UhkConfiguration().fromJsObject(JSON.parse(configJson));
        } else {
            config = this.dataProvider.getUHKConfig();
        }

        return config;
    }

    saveConfig(config: UhkConfiguration): void {
        localStorage.setItem('config', JSON.stringify(config.toJsObject()));
    }
}
