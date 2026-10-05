import {
    ProgressCallback,
    PromptCallback,
    UhkModule,
    UhkDeviceProduct,
} from 'uhk-common';

export interface UpdateLeftModuleWithKbootOptions {
    device: UhkDeviceProduct,
    firmwarePath: string,
    onProgress?: ProgressCallback
    prompt?: PromptCallback
}


export interface UpdateModuleWithKbootOptions extends UpdateLeftModuleWithKbootOptions{
    module: UhkModule,
}
