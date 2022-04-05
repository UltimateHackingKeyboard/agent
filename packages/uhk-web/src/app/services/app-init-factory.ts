import { MonacoEditorCustomThemeService } from './monaco-editor-custom-theme.service';

export default function appInitFactory(
    // the service is not used in the factory, but need to be initialize
    monacoEditorCustomThemeService: MonacoEditorCustomThemeService,
){
    return () => {};
}
