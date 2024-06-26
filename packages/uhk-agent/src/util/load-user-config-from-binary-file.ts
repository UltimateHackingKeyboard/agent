import { readFile } from 'node:fs/promises';
import { UhkBuffer, UserConfiguration } from "uhk-common";

/**
 * Load user configuration history from a binary file.
 *
 * @param filePath - The path to the binary file.
 * @returns The user configuration.
 */
export async function loadUserConfigFromBinaryFile(filePath:string): Promise<UserConfiguration> {
    const buffer = await readFile(filePath);
    const userConfig = new UserConfiguration();

    userConfig.fromBinary(UhkBuffer.fromArray([...buffer]));

    return userConfig;
}
