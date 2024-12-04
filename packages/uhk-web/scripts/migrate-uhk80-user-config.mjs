import fs from 'node:fs/promises';
import process from 'node:process';
import {
    KeyActionHelper,
    Module,
    UserConfiguration,
} from "uhk-common";

const sourceFile = process.argv[2]
const destinationFile = process.argv[3]

const sourceFileJson = JSON.parse(await fs.readFile(sourceFile, { encoding: 'utf8' }));
const userConfig = new UserConfiguration().fromJsonObject(sourceFileJson);

for (const keymap of userConfig.keymaps) {
    for (const layer of keymap.layers) {
        layer.modules = layer.modules.map(originalModule => {
            // right half
            if (originalModule.id === 0) {
                const module = new Module();
                module.id = originalModule.id;

                module.keyActions[0] = KeyActionHelper.fromKeyAction(originalModule.keyActions[0]);
                module.keyActions[1] = KeyActionHelper.fromKeyAction(originalModule.keyActions[1]);
                module.keyActions[2] = KeyActionHelper.fromKeyAction(originalModule.keyActions[2]);
                module.keyActions[3] = KeyActionHelper.fromKeyAction(originalModule.keyActions[3]);
                module.keyActions[4] = KeyActionHelper.fromKeyAction(originalModule.keyActions[4]);
                module.keyActions[5] = KeyActionHelper.fromKeyAction(originalModule.keyActions[5]);
                module.keyActions[6] = KeyActionHelper.fromKeyAction(originalModule.keyActions[6]);
                module.keyActions[7] = KeyActionHelper.fromKeyAction(originalModule.keyActions[14]);
                module.keyActions[8] = KeyActionHelper.fromKeyAction(originalModule.keyActions[7]);
                module.keyActions[9] = KeyActionHelper.fromKeyAction(originalModule.keyActions[8]);
                module.keyActions[10] = KeyActionHelper.fromKeyAction(originalModule.keyActions[9]);
                module.keyActions[11] = KeyActionHelper.fromKeyAction(originalModule.keyActions[10]);
                module.keyActions[12] = KeyActionHelper.fromKeyAction(originalModule.keyActions[11]);
                module.keyActions[13] = KeyActionHelper.fromKeyAction(originalModule.keyActions[12]);
                module.keyActions[14] = KeyActionHelper.fromKeyAction(originalModule.keyActions[13]);
                module.keyActions[15] = KeyActionHelper.fromKeyAction(originalModule.keyActions[21]);
                module.keyActions[16] = KeyActionHelper.fromKeyAction(originalModule.keyActions[15]);
                module.keyActions[17] = KeyActionHelper.fromKeyAction(originalModule.keyActions[16]);
                module.keyActions[18] = KeyActionHelper.fromKeyAction(originalModule.keyActions[17]);
                module.keyActions[19] = KeyActionHelper.fromKeyAction(originalModule.keyActions[18]);
                module.keyActions[20] = KeyActionHelper.fromKeyAction(originalModule.keyActions[19]);
                module.keyActions[21] = KeyActionHelper.fromKeyAction(originalModule.keyActions[20]);
                module.keyActions[22] = KeyActionHelper.fromKeyAction(originalModule.keyActions[22]);
                module.keyActions[23] = KeyActionHelper.fromKeyAction(originalModule.keyActions[23]);
                module.keyActions[24] = KeyActionHelper.fromKeyAction(originalModule.keyActions[24]);
                module.keyActions[25] = KeyActionHelper.fromKeyAction(originalModule.keyActions[25]);
                module.keyActions[26] = KeyActionHelper.fromKeyAction(originalModule.keyActions[26]);
                module.keyActions[27] = KeyActionHelper.fromKeyAction(originalModule.keyActions[27]);
                module.keyActions[28] = KeyActionHelper.fromKeyAction(originalModule.keyActions[29]);
                module.keyActions[29] = KeyActionHelper.fromKeyAction(originalModule.keyActions[31]);
                module.keyActions[30] = KeyActionHelper.fromKeyAction(originalModule.keyActions[32]);
                module.keyActions[31] = KeyActionHelper.fromKeyAction(originalModule.keyActions[33]);
                module.keyActions[32] = KeyActionHelper.fromKeyAction(originalModule.keyActions[34]);
                module.keyActions[33] = KeyActionHelper.fromKeyAction(originalModule.keyActions[30]);
                module.keyActions[34] = KeyActionHelper.fromKeyAction(originalModule.keyActions[56]);
                module.keyActions[35] = KeyActionHelper.fromKeyAction(originalModule.keyActions[35]);
                module.keyActions[36] = KeyActionHelper.fromKeyAction(originalModule.keyActions[36]);
                module.keyActions[37] = KeyActionHelper.fromKeyAction(originalModule.keyActions[37]);
                module.keyActions[38] = KeyActionHelper.fromKeyAction(originalModule.keyActions[38]);
                module.keyActions[39] = KeyActionHelper.fromKeyAction(originalModule.keyActions[39]);
                module.keyActions[40] = KeyActionHelper.fromKeyAction(originalModule.keyActions[40]);
                module.keyActions[41] = KeyActionHelper.fromKeyAction(originalModule.keyActions[41]);
                module.keyActions[42] = KeyActionHelper.fromKeyAction(originalModule.keyActions[42]);
                module.keyActions[43] = KeyActionHelper.fromKeyAction(originalModule.keyActions[43]);
                module.keyActions[44] = KeyActionHelper.fromKeyAction(originalModule.keyActions[44]);
                module.keyActions[45] = KeyActionHelper.fromKeyAction(originalModule.keyActions[45]);
                module.keyActions[46] = KeyActionHelper.fromKeyAction(originalModule.keyActions[46]);
                module.keyActions[47] = KeyActionHelper.fromKeyAction(originalModule.keyActions[47]);
                module.keyActions[48] = KeyActionHelper.fromKeyAction(originalModule.keyActions[48]);
                module.keyActions[49] = KeyActionHelper.fromKeyAction(originalModule.keyActions[49]);
                module.keyActions[50] = KeyActionHelper.fromKeyAction(originalModule.keyActions[50]);
                module.keyActions[51] = KeyActionHelper.fromKeyAction(originalModule.keyActions[51]);
                module.keyActions[52] = KeyActionHelper.fromKeyAction(originalModule.keyActions[52]);
                module.keyActions[53] = KeyActionHelper.fromKeyAction(originalModule.keyActions[53]);
                module.keyActions[54] = KeyActionHelper.fromKeyAction(originalModule.keyActions[54]);
                module.keyActions[55] = KeyActionHelper.fromKeyAction(originalModule.keyActions[55]);

                return module;
            }
            // left half
            else if (originalModule.id === 1) {
                const module = new Module();
                module.id = originalModule.id;

                module.keyActions[0] = KeyActionHelper.fromKeyAction(originalModule.keyActions[0]);
                module.keyActions[1] = KeyActionHelper.fromKeyAction(originalModule.keyActions[1]);
                module.keyActions[2] = KeyActionHelper.fromKeyAction(originalModule.keyActions[2]);
                module.keyActions[3] = KeyActionHelper.fromKeyAction(originalModule.keyActions[3]);
                module.keyActions[4] = KeyActionHelper.fromKeyAction(originalModule.keyActions[4]);
                module.keyActions[5] = KeyActionHelper.fromKeyAction(originalModule.keyActions[5]);
                module.keyActions[6] = KeyActionHelper.fromKeyAction(originalModule.keyActions[6]);
                module.keyActions[7] = KeyActionHelper.fromKeyAction(originalModule.keyActions[7]);
                module.keyActions[8] = KeyActionHelper.fromKeyAction(originalModule.keyActions[8]);
                module.keyActions[9] = KeyActionHelper.fromKeyAction(originalModule.keyActions[9]);
                module.keyActions[10] = KeyActionHelper.fromKeyAction(originalModule.keyActions[10]);
                module.keyActions[11] = KeyActionHelper.fromKeyAction(originalModule.keyActions[11]);
                module.keyActions[12] = KeyActionHelper.fromKeyAction(originalModule.keyActions[13]);
                module.keyActions[13] = KeyActionHelper.fromKeyAction(originalModule.keyActions[14]);
                module.keyActions[14] = KeyActionHelper.fromKeyAction(originalModule.keyActions[15]);
                module.keyActions[15] = KeyActionHelper.fromKeyAction(originalModule.keyActions[16]);
                module.keyActions[16] = KeyActionHelper.fromKeyAction(originalModule.keyActions[17]);
                module.keyActions[17] = KeyActionHelper.fromKeyAction(originalModule.keyActions[18]);
                module.keyActions[18] = KeyActionHelper.fromKeyAction(originalModule.keyActions[20]);
                module.keyActions[19] = KeyActionHelper.fromKeyAction(originalModule.keyActions[21]);
                module.keyActions[20] = KeyActionHelper.fromKeyAction(originalModule.keyActions[22]);
                module.keyActions[21] = KeyActionHelper.fromKeyAction(originalModule.keyActions[23]);
                module.keyActions[22] = KeyActionHelper.fromKeyAction(originalModule.keyActions[24]);
                module.keyActions[23] = KeyActionHelper.fromKeyAction(originalModule.keyActions[25]);
                module.keyActions[24] = KeyActionHelper.fromKeyAction(originalModule.keyActions[26]);
                module.keyActions[25] = KeyActionHelper.fromKeyAction(originalModule.keyActions[27]);
                module.keyActions[26] = KeyActionHelper.fromKeyAction(originalModule.keyActions[28]);
                module.keyActions[27] = KeyActionHelper.fromKeyAction(originalModule.keyActions[29]);
                module.keyActions[28] = KeyActionHelper.fromKeyAction(originalModule.keyActions[30]);
                module.keyActions[29] = KeyActionHelper.fromKeyAction(originalModule.keyActions[31]);
                module.keyActions[30] = KeyActionHelper.fromKeyAction(originalModule.keyActions[33]);
                module.keyActions[31] = KeyActionHelper.fromKeyAction(originalModule.keyActions[32]);
                module.keyActions[32] = KeyActionHelper.fromKeyAction(originalModule.keyActions[41]);
                module.keyActions[33] = KeyActionHelper.fromKeyAction(originalModule.keyActions[34]);
                module.keyActions[34] = KeyActionHelper.fromKeyAction(originalModule.keyActions[35]);
                module.keyActions[35] = KeyActionHelper.fromKeyAction(originalModule.keyActions[36]);
                module.keyActions[36] = KeyActionHelper.fromKeyAction(originalModule.keyActions[37]);
                module.keyActions[37] = KeyActionHelper.fromKeyAction(originalModule.keyActions[38]);
                module.keyActions[38] = KeyActionHelper.fromKeyAction(originalModule.keyActions[39]);
                module.keyActions[39] = KeyActionHelper.fromKeyAction(originalModule.keyActions[40]);

                return module;
            }

            return originalModule;
        })
    }
}

await fs.writeFile(destinationFile, JSON.stringify(userConfig.toJsonObject(), null, 2), { encoding: 'utf8' });
