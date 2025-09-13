import fs from 'node:fs/promises';
import path from 'node:path';
import {
    LayerName,
    UHK_60_LEFT_MAX_KEY_ACTION_COUNT,
    UHK_60_RIGHT_MAX_KEY_ACTION_COUNT,
    UserConfiguration,
} from '../src/config-serializer';

const uhk80UserConfigPath = path.join(import.meta.dirname, '../user-config-80.json');
const uhk80UserConfigJson = JSON.parse(await fs.readFile(uhk80UserConfigPath, { encoding: 'utf8' }));
const uhk60UserConfig = new UserConfiguration().fromJsonObject(uhk80UserConfigJson);
const uhk80UserConfigTsPath = path.join(import.meta.dirname, '../src/user-config-80.ts');
const uhk80UserConfigContent = `export const UHK_80_USER_CONFIG = ${JSON.stringify(uhk80UserConfigJson, null, 2)}`
await fs.writeFile(uhk80UserConfigTsPath, uhk80UserConfigContent, { encoding: 'utf8' });

for (const keymap of uhk60UserConfig.keymaps) {
    const layers = [];

    for (const layer of keymap.layers) {
        if (layer.id === LayerName.fn2) {
            continue;
        }

        layers.push(layer);
        for (const module of layer.modules) {
            // right half
            if (module.id === 0) {
                module.keyActions = module.keyActions.slice(0, UHK_60_RIGHT_MAX_KEY_ACTION_COUNT)
            }
            // left half
            else if (module.id === 1) {
                module.keyActions = module.keyActions.slice(0, UHK_60_LEFT_MAX_KEY_ACTION_COUNT)
            }
        }
    }

    keymap.layers = layers;
}

const uhk60UserConfigPath = path.join(import.meta.dirname, '../user-config.json');
await fs.writeFile(uhk60UserConfigPath, JSON.stringify(uhk60UserConfig.toJsonObject(), null, 2), { encoding: 'utf8' });

const uhk60UserConfigTsPath = path.join(import.meta.dirname, '../src/user-config-60.ts');
const uhk60UserConfigContent = `export const UHK_60_USER_CONFIG = ${JSON.stringify(uhk60UserConfig.toJsonObject(), null, 2)}`
await fs.writeFile(uhk60UserConfigTsPath, uhk60UserConfigContent, { encoding: 'utf8' });
