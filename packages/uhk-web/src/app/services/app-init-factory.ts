import { MonacoEditorUhkSetupService } from './monaco-editor-uhk-setup.service.js';

export default function appInitFactory(
    // the service is not used in the factory, but need to be initialize
    monacoEditorUhkSetupService: MonacoEditorUhkSetupService,
){
    return () => {};
}
