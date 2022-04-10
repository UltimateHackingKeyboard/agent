import { ModuleSlotToId } from 'uhk-common';

import { InvalidArgumentError } from '../invalid-argument-error.js';

export function getModuleSlotIdArgs(): string {
    return Object.keys(ModuleSlotToId)
        .filter(key => isNaN(parseInt(key)))
        .join(', ');
}

export function getModuleSlotIdFromArg(arg: string): ModuleSlotToId {
    const moduleSlotToId = ModuleSlotToId[arg];

    if (moduleSlotToId) {
        return moduleSlotToId;
    }

    throw new InvalidArgumentError(`Invalid module slot, should be either {${getModuleSlotIdArgs()}}`);
}
