import { app } from 'electron';
import { join } from 'path';

export function getSmartMacroDocRootPath(): string {
    return join(app.getPath('userData'), 'smart-macro-docs');
}
