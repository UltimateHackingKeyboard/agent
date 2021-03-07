import { UHK_MODULES, UhkModule } from '../models';

export function findUhkModuleBySlotName(slotName: string): UhkModule {
    return UHK_MODULES.find(module => module.slotName === slotName);
}
