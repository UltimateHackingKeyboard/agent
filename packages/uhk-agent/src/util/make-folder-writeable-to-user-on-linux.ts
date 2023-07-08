import {exec} from 'child_process';
import {platform} from 'os';
import {promisify} from 'util';

const execAsync = promisify(exec);

// Use the os specific command instead of the nodejs fs.chmod, because
// https://github.com/nodejs/node/issues/23736
export async function makeFolderWriteableToUserOnLinux(folder: string): Promise<void>{
    if (platform() !== 'win32') {
        await execAsync(`chmod -R +w "${folder}"`);
    }
    // TODO: implement for windows if needed for someone
}
