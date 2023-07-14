import { cp } from 'fs/promises';
import { join } from 'path';
import { LogService } from 'uhk-common';

import { getSmartMacroDocRootPath } from './get-smart-macro-doc-root-path';

export async function copySmartMacroLoadingHtml(rootDir: string, logger: LogService): Promise<void> {
    logger.misc('[SmartMacroCopy] start copy loading.html');
    const bundledSmartMacroDir = join(rootDir, 'smart-macro-docs');

    await cp(bundledSmartMacroDir, getSmartMacroDocRootPath(), { force: true, recursive: true });

    logger.misc('[SmartMacroCopy] end copy loading.html');
}
