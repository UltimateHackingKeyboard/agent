import { ModuleConfiguration } from 'uhk-common';

export type ModuleConfigurationProperty = Exclude<{
    [K in keyof ModuleConfiguration]: ModuleConfiguration[K] extends (...args: never) => unknown ? never : K
}[keyof ModuleConfiguration], 'id'>;

export type SetModuleConfigurationValuePayload<K extends ModuleConfigurationProperty = ModuleConfigurationProperty> = {
    [P in K]: {
        moduleId: number;
        propertyName: P;
        value: ModuleConfiguration[P];
    }
}[K];

export function applyModuleConfigurationValue<K extends ModuleConfigurationProperty>(
    moduleConfiguration: ModuleConfiguration,
    payload: SetModuleConfigurationValuePayload<K>,
): void {
    moduleConfiguration[payload.propertyName] = payload.value;
}
