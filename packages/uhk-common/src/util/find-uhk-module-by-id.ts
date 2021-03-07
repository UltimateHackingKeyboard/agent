import { UHK_MODULES, UhkModule } from '../models';

export function findUhkModuleById(id: number): UhkModule {
    return UHK_MODULES.find(module => module.id === id);
}
